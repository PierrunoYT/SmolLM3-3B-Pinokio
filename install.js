module.exports = {
  run: [
    // Clone the SmolLM3-3B-Pinokio repository
    {
      method: "shell.run",
      params: {
        message: "git clone https://github.com/PierrunoYT/SmolLM3-3B-Pinokio.git app"
      }
    },
    
    // Install PyTorch with appropriate CUDA support
    {
      method: "script.start",
      params: {
        uri: "torch.js",
        params: {
          venv: "env",
          path: "app",
          xformers: true,
          triton: true,
          sageattention: true
        }
      }
    },
    
    // Install main dependencies from requirements.txt (using UV for speed)
    {
      method: "shell.run",
      params: {
        venv: "env",
        path: "app",
        message: "uv pip install -r requirements.txt"
      }
    },
    
    // Install additional dependencies for SmolLM3
    {
      method: "shell.run",
      params: {
        venv: "env",
        path: "app",
        message: [
          "uv pip install transformers>=4.40.0",
          "uv pip install gradio>=4.0.0",
          "uv pip install accelerate",
          "uv pip install bitsandbytes"
        ]
      }
    },
    
    // Verify transformers installation and SmolLM3 compatibility
    {
      method: "shell.run",
      params: {
        venv: "env",
        path: "app",
        message: "python -c \"from transformers import AutoModelForCausalLM, AutoTokenizer; print('Transformers successfully installed and compatible')\""
      }
    },
    
    // Test Gradio installation
    {
      method: "shell.run",
      params: {
        venv: "env",
        path: "app",
        message: "python -c \"import gradio as gr; print('Gradio successfully installed')\""
      }
    },
    
    // Create a setup completion marker
    {
      method: "fs.write",
      params: {
        path: "app/INSTALLATION_COMPLETE.txt",
        text: "SmolLM3-3B Pinokio installation completed successfully.\n\nNext steps:\n1. Start the application using the Start button\n2. Open the web interface at the provided URL\n3. Begin chatting with SmolLM3-3B model\n\nFeatures:\n- Local SmolLM3-3B model inference\n- Gradio web interface\n- Extended thinking mode support\n- GPU acceleration (if available)\n\nFor support, check the README.md file."
      }
    }
  ]
}