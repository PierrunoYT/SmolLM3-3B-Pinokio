import argparse
import inspect
import sys

import gradio as gr
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer

# Model configuration
MODEL_NAME = "HuggingFaceTB/SmolLM3-3B"

# Populated by load_model(); kept at module scope so the Gradio callbacks can
# reach them without threading state through every handler.
tokenizer = None
model = None
device = "cpu"


def detect_device():
    """Pick the best available torch device."""
    if torch.cuda.is_available():
        return "cuda"

    mps = getattr(torch.backends, "mps", None)
    if mps is not None and mps.is_available():
        return "mps"

    return "cpu"


def load_model():
    """Load the tokenizer and model onto the best available device."""
    global tokenizer, model, device

    device = detect_device()

    print("Loading SmolLM3-3B model...")
    print(f"Device: {device}")
    print(f"PyTorch version: {torch.__version__}")

    try:
        tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
        model = AutoModelForCausalLM.from_pretrained(
            MODEL_NAME,
            torch_dtype=torch.float16 if device in {"cuda", "mps"} else torch.float32,
            # Only CUDA benefits from accelerate's sharding; mps/cpu are moved
            # explicitly below so the weights never get offloaded to disk.
            device_map="auto" if device == "cuda" else None,
        )
        if device != "cuda":
            model = model.to(device)

        model.eval()

        print(f"Model loaded successfully on {device}")
    except Exception as e:
        print(f"Error loading model: {e}")
        sys.exit(1)


def format_prompt(prompt, enable_thinking=False):
    """Build a chat prompt with the tokenizer template when available.

    Returns (text, used_template) so the caller knows whether the string
    already carries the special tokens the template inserted.
    """
    messages = [{"role": "user", "content": prompt}]

    if hasattr(tokenizer, "apply_chat_template") and getattr(
        tokenizer, "chat_template", None
    ):
        template_kwargs = {
            "tokenize": False,
            "add_generation_prompt": True,
        }

        try:
            parameters = inspect.signature(tokenizer.apply_chat_template).parameters
            accepts_enable_thinking = "enable_thinking" in parameters or any(
                param.kind == inspect.Parameter.VAR_KEYWORD
                for param in parameters.values()
            )
        except (TypeError, ValueError):
            accepts_enable_thinking = False

        if accepts_enable_thinking:
            template_kwargs["enable_thinking"] = enable_thinking

        return tokenizer.apply_chat_template(messages, **template_kwargs), True

    return f"User: {prompt}\nAssistant:", False


def chat(prompt, enable_thinking=False, max_tokens=256, temperature=0.6, top_p=0.95):
    """Generate a response using SmolLM3-3B."""
    if model is None or tokenizer is None:
        return "Model is not loaded yet. Please restart the app."

    if not prompt or not prompt.strip():
        return "Please enter a prompt."

    try:
        text, used_template = format_prompt(prompt, enable_thinking=enable_thinking)
        # The chat template already emits BOS/special tokens; re-adding them
        # here would prepend a duplicate BOS and skew generation.
        model_inputs = tokenizer(
            [text],
            return_tensors="pt",
            add_special_tokens=not used_template,
        ).to(model.device)

        with torch.no_grad():
            generated_ids = model.generate(
                **model_inputs,
                max_new_tokens=int(max_tokens),
                temperature=float(temperature),
                top_p=float(top_p),
                do_sample=True,
                eos_token_id=tokenizer.eos_token_id,
                pad_token_id=(
                    tokenizer.pad_token_id
                    if tokenizer.pad_token_id is not None
                    else tokenizer.eos_token_id
                ),
            )

        output_ids = generated_ids[0][model_inputs.input_ids.shape[-1] :]
        response = tokenizer.decode(output_ids, skip_special_tokens=True)
        return response.strip()

    except torch.cuda.OutOfMemoryError:
        torch.cuda.empty_cache()
        return "Out of GPU memory. Try lowering Max Tokens or restarting the app."
    except Exception as e:
        return f"Error generating response: {e}"


def create_interface():
    """Create and configure the Gradio interface."""
    with gr.Blocks(title="SmolLM3-3B Chatbot", theme=gr.themes.Soft()) as iface:
        gr.Markdown(
            """
            # SmolLM3-3B Chatbot

            A local AI chatbot powered by SmolLM3-3B. This model runs entirely on your machine.

            **Features:**
            - Natural conversation
            - Extended thinking mode for reasoning
            - GPU acceleration (if available)
            - Complete privacy (no data sent to external servers)
            """
        )

        with gr.Row():
            with gr.Column(scale=2):
                prompt_input = gr.Textbox(
                    label="Your Message",
                    placeholder="Ask me anything...",
                    lines=3,
                    max_lines=10,
                )

                with gr.Row():
                    submit_btn = gr.Button("Send", variant="primary", scale=2)
                    clear_btn = gr.Button("Clear", scale=1)

            with gr.Column(scale=1):
                thinking_mode = gr.Checkbox(
                    label="Extended Thinking Mode",
                    value=False,
                    info="Enable reasoning traces",
                )

                max_tokens = gr.Slider(
                    minimum=50,
                    maximum=1000,
                    value=256,
                    step=50,
                    label="Max Tokens",
                )

                temperature = gr.Slider(
                    minimum=0.1,
                    maximum=2.0,
                    value=0.6,
                    step=0.1,
                    label="Temperature",
                )

                top_p = gr.Slider(
                    minimum=0.1,
                    maximum=1.0,
                    value=0.95,
                    step=0.05,
                    label="Top-p",
                )

        response_output = gr.Textbox(
            label="SmolLM3 Response",
            lines=10,
            max_lines=20,
            interactive=False,
        )

        inputs = [prompt_input, thinking_mode, max_tokens, temperature, top_p]

        submit_btn.click(fn=chat, inputs=inputs, outputs=response_output)
        prompt_input.submit(fn=chat, inputs=inputs, outputs=response_output)

        clear_btn.click(
            fn=lambda: ("", ""),
            inputs=None,
            outputs=[prompt_input, response_output],
        )

        gr.Markdown(
            f"""
            ---
            **System Info:**
            - Device: {device.upper()}
            - Model: {MODEL_NAME}
            - PyTorch: {torch.__version__}
            """
        )

    return iface


def main():
    parser = argparse.ArgumentParser(description="SmolLM3-3B Gradio Interface")
    parser.add_argument("--port", type=int, default=7860, help="Port to run the server on")
    parser.add_argument("--host", type=str, default="127.0.0.1", help="Host to run the server on")
    parser.add_argument("--share", action="store_true", help="Create a public link")

    args = parser.parse_args()

    # Loaded after argument parsing so `--help` and bad arguments fail fast
    # instead of downloading several gigabytes of weights first.
    load_model()

    print(f"Starting Gradio interface on {args.host}:{args.port}")

    interface = create_interface()
    interface.launch(
        server_name=args.host,
        server_port=args.port,
        share=args.share,
        show_error=True,
    )


if __name__ == "__main__":
    main()
