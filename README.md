# SmolLM3-3B Chatbot (Pinokio)

Local chat UI for [SmolLM3-3B](https://huggingface.co/HuggingFaceTB/SmolLM3-3B) using a Gradio web app. The model and tokenizer load on your machine; nothing is sent to external APIs beyond Hugging Face Hub downloads for the model weights (unless you change that in code).

## What it does

- Installs Python dependencies and PyTorch (via `torch.js` for your OS/GPU).
- Starts a Gradio server that prints a local URL; Pinokio captures that URL for an **Open Web UI** action.
- Supports optional **Save Disk Space** (`link.js`) to deduplicate the virtual environment.

## How to use (Pinokio)

1. Open this project in Pinokio.
2. Run **Install** once.
3. Run **Start** and use **Open Web UI** when it appears, or open the **Terminal** tab for logs.

**Update** runs `git pull` and reinstalls dependencies. **Reset** removes the virtual environment(s) so you can reinstall cleanly; it does **not** delete application source under `app/`.

## Programmatic access

### JavaScript (Pinokio scripts)

Launcher scripts live in the project root: `install.js`, `start.js`, `update.js`, `reset.js`, `link.js`, `torch.js`. The UI is defined in `pinokio.js`. From another Pinokio script you can start flows with `script.start` (see Pinokio `PINOKIO.md`).

### Python

Run the app directly after activating the same venv Pinokio uses (`env` at project root):

```bash
# Windows (example)
env\Scripts\activate
cd app
python app.py --host 127.0.0.1 --port 7860
```

### cURL

With the server running at `http://127.0.0.1:<port>`, use Gradio’s HTTP API. Fetch the OpenAPI schema from the running app (Gradio exposes API docs) or use `gradio_client` from Python for typed calls.

Example (replace `PORT` with the port shown in the terminal):

```bash
curl -s "http://127.0.0.1:PORT/" -o /dev/null
```

For generation, prefer the **Gradio Client** library or the interactive UI; exact JSON routes depend on your Gradio version.

## Layout

- `app/` — application code (`app.py`, `requirements.txt`).
- Root — Pinokio launcher scripts and shared `env/` virtual environment.
