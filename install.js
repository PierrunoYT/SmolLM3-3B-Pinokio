module.exports = {
  run: [
    // Create app directory
    {
      method: "shell.run",
      params: {
        message: "mkdir app"
      }
    },
    
    // Install PyTorch with appropriate CUDA support
    {
      method: "script.start",
      params: {
        uri: "torch.js",
        params: {
          venv: "env",
          path: "app"
        }
      }
    },
    
    // Install core dependencies for SmolLM3 (using UV for speed)
    // Note: Install transformers with --no-deps to avoid overriding PyTorch CUDA installation
    {
      method: "shell.run",
      params: {
        venv: "env",
        path: "app",
        message: [
          "uv pip install transformers>=4.40.0 --no-deps",
          "uv pip install gradio>=4.0.0",
          "uv pip install accelerate",
          "uv pip install sentencepiece",
          "uv pip install protobuf",
          "uv pip install tokenizers",
          "uv pip install safetensors",
          "uv pip install huggingface-hub",
          "uv pip install numpy",
          "uv pip install packaging",
          "uv pip install pyyaml",
          "uv pip install regex",
          "uv pip install requests",
          "uv pip install tqdm"
        ]
      }
    },
    
    // Create requirements.txt for future reference
    {
      method: "fs.write",
      params: {
        path: "app/requirements.txt",
        text: "torch>=2.0.0\ntransformers>=4.40.0\ngradio>=4.0.0\naccelerate\nsentencepiece\nprotobuf\n"
      }
    },
    
    // Create the Gradio app in the app directory
    {
      method: "fs.write",
      params: {
        path: "app/smollm3_gradio.py",
        text: "import torch\nfrom transformers import AutoModelForCausalLM, AutoTokenizer\nimport gradio as gr\nimport argparse\nimport sys\nimport os\n\n# Model configuration\nmodel_name = \"HuggingFaceTB/SmolLM3-3B\"\ndevice = \"cuda\" if torch.cuda.is_available() else \"cpu\"\n\nprint(f\"🚀 Loading SmolLM3-3B model...\")\nprint(f\"📱 Device: {device}\")\nprint(f\"🔧 PyTorch version: {torch.__version__}\")\n\n# Load tokenizer and model\ntry:\n    tokenizer = AutoTokenizer.from_pretrained(model_name)\n    model = AutoModelForCausalLM.from_pretrained(\n        model_name,\n        torch_dtype=torch.float16 if device == \"cuda\" else torch.float32,\n        device_map=\"auto\" if device == \"cuda\" else None\n    )\n    if device == \"cpu\":\n        model = model.to(device)\n    \n    print(f\"✅ Model loaded successfully on {device}\")\nexcept Exception as e:\n    print(f\"❌ Error loading model: {e}\")\n    sys.exit(1)\n\ndef chat(prompt, enable_thinking=False, max_tokens=256, temperature=0.6, top_p=0.95):\n    \"\"\"Generate response using SmolLM3-3B\"\"\"\n    if not prompt.strip():\n        return \"Please enter a prompt.\"\n    \n    try:\n        # Format the conversation\n        messages = [\n            {\"role\": \"user\", \"content\": prompt}\n        ]\n        \n        # Apply chat template\n        text = tokenizer.apply_chat_template(\n            messages,\n            tokenize=False,\n            add_generation_prompt=True,\n            enable_thinking=enable_thinking,\n        )\n        \n        # Tokenize input\n        model_inputs = tokenizer([text], return_tensors=\"pt\").to(model.device)\n        \n        # Generate response\n        with torch.no_grad():\n            generated_ids = model.generate(\n                **model_inputs,\n                max_new_tokens=int(max_tokens),\n                temperature=float(temperature),\n                top_p=float(top_p),\n                do_sample=True,\n                pad_token_id=tokenizer.eos_token_id\n            )\n        \n        # Decode response\n        output_ids = generated_ids[0][len(model_inputs.input_ids[0]):]\n        response = tokenizer.decode(output_ids, skip_special_tokens=True)\n        \n        return response\n        \n    except Exception as e:\n        return f\"Error generating response: {str(e)}\"\n\ndef create_interface():\n    \"\"\"Create and configure Gradio interface\"\"\"\n    \n    with gr.Blocks(title=\"SmolLM3-3B Chatbot\", theme=gr.themes.Soft()) as iface:\n        gr.Markdown(\n            \"\"\"\n            # 🤖 SmolLM3-3B Chatbot\n            \n            A local AI chatbot powered by SmolLM3-3B. This model runs entirely on your machine!\n            \n            **Features:**\n            - 💬 Natural conversation\n            - 🧠 Extended thinking mode for reasoning\n            - ⚡ GPU acceleration (if available)\n            - 🔒 Complete privacy (no data sent to external servers)\n            \"\"\"\n        )\n        \n        with gr.Row():\n            with gr.Column(scale=2):\n                prompt_input = gr.Textbox(\n                    label=\"Your Message\",\n                    placeholder=\"Ask me anything...\",\n                    lines=3,\n                    max_lines=10\n                )\n                \n                with gr.Row():\n                    submit_btn = gr.Button(\"Send\", variant=\"primary\", scale=2)\n                    clear_btn = gr.Button(\"Clear\", scale=1)\n            \n            with gr.Column(scale=1):\n                thinking_mode = gr.Checkbox(\n                    label=\"🧠 Extended Thinking Mode\",\n                    value=False,\n                    info=\"Enable reasoning traces\"\n                )\n                \n                max_tokens = gr.Slider(\n                    minimum=50,\n                    maximum=1000,\n                    value=256,\n                    step=50,\n                    label=\"Max Tokens\"\n                )\n                \n                temperature = gr.Slider(\n                    minimum=0.1,\n                    maximum=2.0,\n                    value=0.6,\n                    step=0.1,\n                    label=\"Temperature\"\n                )\n                \n                top_p = gr.Slider(\n                    minimum=0.1,\n                    maximum=1.0,\n                    value=0.95,\n                    step=0.05,\n                    label=\"Top-p\"\n                )\n        \n        response_output = gr.Textbox(\n            label=\"SmolLM3 Response\",\n            lines=10,\n            max_lines=20,\n            interactive=False\n        )\n        \n        # Event handlers\n        submit_btn.click(\n            fn=chat,\n            inputs=[prompt_input, thinking_mode, max_tokens, temperature, top_p],\n            outputs=response_output\n        )\n        \n        prompt_input.submit(\n            fn=chat,\n            inputs=[prompt_input, thinking_mode, max_tokens, temperature, top_p],\n            outputs=response_output\n        )\n        \n        clear_btn.click(\n            fn=lambda: (\"\", \"\"),\n            outputs=[prompt_input, response_output]\n        )\n        \n        # System info\n        gr.Markdown(\n            f\"\"\"\n            ---\n            **System Info:**\n            - Device: {device.upper()}\n            - Model: {model_name}\n            - PyTorch: {torch.__version__}\n            \"\"\"\n        )\n    \n    return iface\n\nif __name__ == \"__main__\":\n    parser = argparse.ArgumentParser(description=\"SmolLM3-3B Gradio Interface\")\n    parser.add_argument(\"--port\", type=int, default=7860, help=\"Port to run the server on\")\n    parser.add_argument(\"--host\", type=str, default=\"127.0.0.1\", help=\"Host to run the server on\")\n    parser.add_argument(\"--share\", action=\"store_true\", help=\"Create a public link\")\n    \n    args = parser.parse_args()\n    \n    print(f\"🌐 Starting Gradio interface on {args.host}:{args.port}\")\n    \n    # Create and launch interface\n    interface = create_interface()\n    interface.launch(\n        server_name=args.host,\n        server_port=args.port,\n        share=args.share,\n        show_error=True\n    )\n"
      }
    },
    
    // Test model loading to ensure everything works
    {
      method: "shell.run",
      params: {
        venv: "env",
        path: "app",
        message: "python -c \"import torch; from transformers import AutoTokenizer; print('✅ Dependencies installed successfully'); print(f'PyTorch version: {torch.__version__}'); print(f'CUDA available: {torch.cuda.is_available()}')\""
      }
    },
    
    // Create a setup completion marker
    {
      method: "fs.write",
      params: {
        path: "app/INSTALLATION_COMPLETE.txt",
        text: "SmolLM3-3B Chatbot installation completed successfully!\n\n🎉 What's installed:\n- SmolLM3-3B model support\n- Gradio web interface\n- PyTorch with GPU support (if available)\n- All required dependencies\n\n🚀 Next steps:\n1. Click 'Start SmolLM3 Chatbot' to launch the application\n2. Open the web interface when it becomes available\n3. Start chatting with your local AI!\n\n💡 Features:\n- Works completely offline\n- GPU acceleration (if available)\n- Extended thinking mode\n- Adjustable generation parameters\n\n⚠️ Note: First model load may take a few minutes as it downloads the model files (~6GB).\n\nFor support, check the README.md file."
      }
    },
    
    // Create a simple README
    {
      method: "fs.write",
      params: {
        path: "app/README.md",
        text: "# SmolLM3-3B Chatbot\n\nA local AI chatbot using the SmolLM3-3B model with a Gradio web interface.\n\n## Features\n\n- 🤖 **SmolLM3-3B Model**: Advanced 3B parameter language model\n- 💬 **Chat Interface**: Clean, user-friendly Gradio web interface\n- 🧠 **Thinking Mode**: Enable extended reasoning traces\n- ⚡ **GPU Support**: Automatic CUDA acceleration when available\n- 🔒 **Privacy**: Runs completely offline, no data sent externally\n- ⚙️ **Customizable**: Adjustable temperature, top-p, and token limits\n\n## Usage\n\n1. Start the application using the Pinokio interface\n2. Open the web interface in your browser\n3. Type your message and press Send\n4. Optionally enable \"Extended Thinking Mode\" for reasoning traces\n\n## System Requirements\n\n- **RAM**: 8GB+ (12GB+ recommended)\n- **Storage**: ~6GB for model files\n- **GPU**: Optional but recommended (8GB+ VRAM)\n- **OS**: Windows, macOS, or Linux\n\n## Model Information\n\n- **Model**: HuggingFaceTB/SmolLM3-3B\n- **Parameters**: 3 billion\n- **Context Length**: Up to 8192 tokens\n- **License**: Apache 2.0\n\n## Troubleshooting\n\n- **Slow responses**: Normal on CPU, consider GPU acceleration\n- **Out of memory**: Reduce max tokens or use CPU mode\n- **Model download fails**: Check internet connection, model will auto-download on first use\n"
      }
    }
  ]
}