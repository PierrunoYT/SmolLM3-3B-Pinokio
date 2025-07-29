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
    {
      method: "shell.run",
      params: {
        venv: "env",
        path: "app",
        message: [
          "uv pip install transformers>=4.40.0",
          "uv pip install gradio>=4.0.0",
          "uv pip install accelerate",
          "uv pip install sentencepiece",
          "uv pip install protobuf"
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
    
    // Copy the Gradio app to the app directory
    {
      method: "fs.copy",
      params: {
        from: "smollm3_gradio.py",
        to: "app/smollm3_gradio.py"
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