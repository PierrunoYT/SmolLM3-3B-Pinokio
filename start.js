module.exports = async (kernel) => {
  const port = await kernel.port()  // Get available port
  
  return {
    daemon: true,  // Keep running in background
    run: [
      // Start the SmolLM3 Gradio interface
      {
        method: "shell.run",
        params: {
          venv: "env",
          path: "app",
          env: {
            GRADIO_SERVER_PORT: port.toString(),
            GRADIO_SERVER_NAME: "0.0.0.0"
          },
          message: `python smollm3_gradio.py --port ${port} --host 0.0.0.0`,
          on: [{
            // Wait for Gradio server to start - look for the running message
            event: "/Running on local URL:.*http:\\/\\/[0-9.:]+:[0-9]+/",
            done: true
          }, {
            // Alternative pattern for Gradio startup
            event: "/Running on public URL:.*https:\\/\\/[a-zA-Z0-9.-]+\\.gradio\\.live/",
            done: true
          }, {
            // Fallback pattern for server startup
            event: "/Gradio app running/",
            done: true
          }, {
            // Generic localhost pattern
            event: `/http:\\/\\/localhost:${port}/`,
            done: true
          }, {
            // SmolLM3 specific startup patterns
            event: "/Starting Gradio interface/",
            done: true
          }, {
            // Model loading completion
            event: "/Model loaded successfully/",
            done: false
          }]
        }
      },
      
      // Set the local URL for the "Open Web UI" button
      {
        method: "local.set",
        params: {
          url: `http://localhost:${port}`
        }
      },
      
      // Log success message
      {
        method: "log",
        params: {
          text: `🤖 SmolLM3-3B Chatbot is running at http://localhost:${port}`
        }
      }
    ]
  }
}