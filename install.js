module.exports = {
  run: [
    {
      method: "shell.run",
      params: {
        message: "git clone https://github.com/PierrunoYT/SmolLM3-3B-Pinokio-Gradio.git app"
      }
    },
    {
      method: "shell.run",
      params: {
        venv: "env",
        path: "app",
        message: "uv pip install -r requirements.txt"
      }
    },
    {
      method: "script.start",
      params: {
        uri: "torch.js",
        params: {
          venv: "env",
          path: "app"
        }
      }
    }
  ]
}
