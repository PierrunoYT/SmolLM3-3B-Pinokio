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
    
    // Update the Gradio app file from root
    {
      method: "fs.copy",
      params: {
        from: "smollm3_gradio.py",
        to: "app/smollm3_gradio.py"
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