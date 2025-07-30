module.exports = {
  run: [
    // Remove existing app directory if it exists (Windows)
    {
      when: "{{platform === 'win32'}}",
      method: "shell.run",
      params: {
        message: "if exist app rmdir /s /q app"
      }
    },
    
    // Remove existing app directory if it exists (Unix-like)
    {
      when: "{{platform !== 'win32'}}",
      method: "shell.run",
      params: {
        message: "if [ -d app ]; then rm -rf app; fi"
      }
    },
    
    // Clone the SmolLM3-3B-Pinokio repository
    {
      method: "shell.run",
      params: {
        message: "git clone https://github.com/PierrunoYT/SmolLM3-3B-Pinokio.git app"
      }
    },
    
    // Install main dependencies from requirements.txt first (using UV for speed)
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
        message: "uv pip install transformers>=4.40.0 gradio>=4.0.0 accelerate bitsandbytes"
      }
    },
    
    // Install PyTorch LAST (AFTER all other packages to prevent version conflicts)
    {
      method: "script.start",
      params: {
        uri: "torch.js",
        params: {
          venv: "env",
          path: "app",
          xformers: true,
          triton: true,
          sageattention: true,
          force_reinstall: true
        }
      }
    },
    
    // Verify PyTorch installation and CUDA availability
    {
      method: "shell.run",
      params: {
        venv: "env",
        path: "app",
        message: "python -c \"import torch; print(f'PyTorch {torch.__version__} CUDA: {torch.cuda.is_available()}')\""
      }
    },
    
    
    // Final verification of all components
    {
      method: "shell.run",
      params: {
        venv: "env",
        path: "app",
        message: "python -c \"import torch, transformers, gradio, accelerate; print('All core components verified successfully')\""
      }
    },
    
    // Create a setup completion marker
    {
      method: "fs.write",
      params: {
        path: "app/INSTALLATION_COMPLETE.txt",
        text: "SmolLM3-3B Pinokio installation completed successfully.\n\nNext steps:\n1. Start the application using the Start button\n2. Open the web interface at the provided URL\n3. Begin chatting with SmolLM3-3B model\n\nFeatures:\n- Local SmolLM3-3B model inference\n- Gradio web interface\n- Extended thinking mode support\n- GPU acceleration (if available)\n- PyTorch with CUDA support (if NVIDIA GPU detected)\n\nFor support, check the README.md file.\n\nNote: All models will be downloaded automatically on first run."
      }
    }
  ]
}