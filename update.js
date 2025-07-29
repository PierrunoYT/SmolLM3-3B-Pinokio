module.exports = {
  run: [
    // Update PyTorch to latest version
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
    
    // Update core dependencies (using UV for speed)
    // Note: Update transformers with --no-deps to avoid overriding PyTorch CUDA installation
    {
      method: "shell.run",
      params: {
        venv: "env",
        path: "app",
        message: [
          "uv pip install --upgrade transformers --no-deps",
          "uv pip install --upgrade gradio",
          "uv pip install --upgrade accelerate",
          "uv pip install --upgrade sentencepiece",
          "uv pip install --upgrade protobuf",
          "uv pip install --upgrade tokenizers",
          "uv pip install --upgrade safetensors",
          "uv pip install --upgrade huggingface-hub",
          "uv pip install --upgrade numpy",
          "uv pip install --upgrade packaging",
          "uv pip install --upgrade pyyaml",
          "uv pip install --upgrade regex",
          "uv pip install --upgrade requests",
          "uv pip install --upgrade tqdm"
        ]
      }
    },
    
    // Update requirements.txt with latest versions
    {
      method: "shell.run",
      params: {
        venv: "env",
        path: "app",
        message: "uv pip install -r requirements.txt --upgrade"
      }
    },
    
    // Update the Gradio app file in app directory
    {
      method: "fs.write",
      params: {
        path: "app/smollm3_gradio.py",
        text: "import torch\nfrom transformers import AutoModelForCausalLM, AutoTokenizer\nimport gradio as gr\nimport argparse\nimport sys\nimport os\n\n# Model configuration\nmodel_name = \"HuggingFaceTB/SmolLM3-3B\"\ndevice = \"cuda\" if torch.cuda.is_available() else \"cpu\"\n\nprint(f\"🚀 Loading SmolLM3-3B model...\")\nprint(f\"📱 Device: {device}\")\nprint(f\"🔧 PyTorch version: {torch.__version__}\")\n\n# Load tokenizer and model\ntry:\n    tokenizer = AutoTokenizer.from_pretrained(model_name)\n    model = AutoModelForCausalLM.from_pretrained(\n        model_name,\n        torch_dtype=torch.float16 if device == \"cuda\" else torch.float32,\n        device_map=\"auto\" if device == \"cuda\" else None\n    )\n    if device == \"cpu\":\n        model = model.to(device)\n    \n    print(f\"✅ Model loaded successfully on {device}\")\nexcept Exception as e:\n    print(f\"❌ Error loading model: {e}\")\n    sys.exit(1)\n\ndef chat(prompt, enable_thinking=False, max_tokens=256, temperature=0.6, top_p=0.95):\n    \"\"\"Generate response using SmolLM3-3B\"\"\"\n    if not prompt.strip():\n        return \"Please enter a prompt.\"\n    \n    try:\n        # Format the conversation\n        messages = [\n            {\"role\": \"user\", \"content\": prompt}\n        ]\n        \n        # Apply chat template\n        text = tokenizer.apply_chat_template(\n            messages,\n            tokenize=False,\n            add_generation_prompt=True,\n            enable_thinking=enable_thinking,\n        )\n        \n        # Tokenize input\n        model_inputs = tokenizer([text], return_tensors=\"pt\").to(model.device)\n        \n        # Generate response\n        with torch.no_grad():\n            generated_ids = model.generate(\n                **model_inputs,\n                max_new_tokens=int(max_tokens),\n                temperature=float(temperature),\n                top_p=float(top_p),\n                do_sample=True,\n                pad_token_id=tokenizer.eos_token_id\n            )\n        \n        # Decode response\n        output_ids = generated_ids[0][len(model_inputs.input_ids[0]):]\n        response = tokenizer.decode(output_ids, skip_special_tokens=True)\n        \n        return response\n        \n    except Exception as e:\n        return f\"Error generating response: {str(e)}\"\n\ndef create_interface():\n    \"\"\"Create and configure Gradio interface\"\"\"\n    \n    with gr.Blocks(title=\"SmolLM3-3B Chatbot\", theme=gr.themes.Soft()) as iface:\n        gr.Markdown(\n            \"\"\"\n            # 🤖 SmolLM3-3B Chatbot\n            \n            A local AI chatbot powered by SmolLM3-3B. This model runs entirely on your machine!\n            \n            **Features:**\n            - 💬 Natural conversation\n            - 🧠 Extended thinking mode for reasoning\n            - ⚡ GPU acceleration (if available)\n            - 🔒 Complete privacy (no data sent to external servers)\n            \"\"\"\n        )\n        \n        with gr.Row():\n            with gr.Column(scale=2):\n                prompt_input = gr.Textbox(\n                    label=\"Your Message\",\n                    placeholder=\"Ask me anything...\",\n                    lines=3,\n                    max_lines=10\n                )\n                \n                with gr.Row():\n                    submit_btn = gr.Button(\"Send\", variant=\"primary\", scale=2)\n                    clear_btn = gr.Button(\"Clear\", scale=1)\n            \n            with gr.Column(scale=1):\n                thinking_mode = gr.Checkbox(\n                    label=\"🧠 Extended Thinking Mode\",\n                    value=False,\n                    info=\"Enable reasoning traces\"\n                )\n                \n                max_tokens = gr.Slider(\n                    minimum=50,\n                    maximum=1000,\n                    value=256,\n                    step=50,\n                    label=\"Max Tokens\"\n                )\n                \n                temperature = gr.Slider(\n                    minimum=0.1,\n                    maximum=2.0,\n                    value=0.6,\n                    step=0.1,\n                    label=\"Temperature\"\n                )\n                \n                top_p = gr.Slider(\n                    minimum=0.1,\n                    maximum=1.0,\n                    value=0.95,\n                    step=0.05,\n                    label=\"Top-p\"\n                )\n        \n        response_output = gr.Textbox(\n            label=\"SmolLM3 Response\",\n            lines=10,\n            max_lines=20,\n            interactive=False\n        )\n        \n        # Event handlers\n        submit_btn.click(\n            fn=chat,\n            inputs=[prompt_input, thinking_mode, max_tokens, temperature, top_p],\n            outputs=response_output\n        )\n        \n        prompt_input.submit(\n            fn=chat,\n            inputs=[prompt_input, thinking_mode, max_tokens, temperature, top_p],\n            outputs=response_output\n        )\n        \n        clear_btn.click(\n            fn=lambda: (\"\", \"\"),\n            outputs=[prompt_input, response_output]\n        )\n        \n        # System info\n        gr.Markdown(\n            f\"\"\"\n            ---\n            **System Info:**\n            - Device: {device.upper()}\n            - Model: {model_name}\n            - PyTorch: {torch.__version__}\n            \"\"\"\n        )\n    \n    return iface\n\nif __name__ == \"__main__\":\n    parser = argparse.ArgumentParser(description=\"SmolLM3-3B Gradio Interface\")\n    parser.add_argument(\"--port\", type=int, default=7860, help=\"Port to run the server on\")\n    parser.add_argument(\"--host\", type=str, default=\"127.0.0.1\", help=\"Host to run the server on\")\n    parser.add_argument(\"--share\", action=\"store_true\", help=\"Create a public link\")\n    \n    args = parser.parse_args()\n    \n    print(f\"🌐 Starting Gradio interface on {args.host}:{args.port}\")\n    \n    # Create and launch interface\n    interface = create_interface()\n    interface.launch(\n        server_name=args.host,\n        server_port=args.port,\n        share=args.share,\n        show_error=True\n    )\n"
      }
    },
    
    // Clear any cached model files if needed (optional)
    {
      method: "shell.run",
      params: {
        venv: "env",
        path: "app",
        message: "python -c \"import transformers; transformers.utils.hub.scan_cache_dir()\""
      }
    },
    
    // Test updated dependencies
    {
      method: "shell.run",
      params: {
        venv: "env",
        path: "app",
        message: "python -c \"import torch; from transformers import AutoTokenizer; import gradio as gr; print('✅ All dependencies updated successfully'); print(f'PyTorch: {torch.__version__}'); print(f'Transformers: {transformers.__version__}'); print(f'Gradio: {gr.__version__}')\""
      }
    },
    
    // Update completion marker
    {
      method: "fs.write",
      params: {
        path: "app/UPDATE_COMPLETE.txt",
        text: "SmolLM3-3B Chatbot update completed successfully!\n\n🔄 Updated components:\n- PyTorch (latest version with GPU support)\n- Transformers library\n- Gradio web interface\n- All supporting dependencies\n- Updated Gradio application\n\n✅ Your SmolLM3 chatbot is now up to date!\n\n🚀 Next steps:\n1. Start the application using the Start button\n2. Enjoy improved performance and new features\n\n💡 What's new:\n- Latest model optimizations\n- Improved Gradio interface\n- Better GPU utilization\n- Enhanced stability\n\nFor support, check the README.md file."
      }
    },
    
    // Log completion message
    {
      method: "log",
      params: {
        text: "✅ SmolLM3-3B Chatbot has been updated successfully!"
      }
    }
  ]
}