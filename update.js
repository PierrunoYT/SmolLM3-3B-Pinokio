module.exports = {
  run: [
    // Update the main Pinokio script repository
    {
      method: "shell.run",
      params: {
        message: "git pull"
      }
    },
    
    // Update the SmolLM3-3B app repository
    {
      method: "shell.run",
      params: {
        path: "app",
        message: "git pull"
      }
    },
    
    // Update Python dependencies
    {
      method: "shell.run",
      params: {
        venv: "env",
        path: "app",
        message: "uv pip install --upgrade -r requirements.txt"
      }
    },
    
    // Update transformers to latest version
    {
      method: "shell.run",
      params: {
        venv: "env",
        path: "app",
        message: "uv pip install --upgrade transformers gradio accelerate"
      }
    },
    
    // Log completion message
    {
      method: "log",
      params: {
        text: "✅ SmolLM3-3B has been updated successfully. You can now start the application."
      }
    }
  ]
}