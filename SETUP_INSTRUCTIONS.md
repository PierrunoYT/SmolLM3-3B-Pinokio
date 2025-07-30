# SmolLM3-3B Pinokio Package Setup Instructions

## Package Structure

This Pinokio package clones the SmolLM3-3B repository and installs all dependencies automatically. The SmolLM3-3B model downloads automatically on first use.

### 1. Package Files ✅ Complete

The package includes these core files:
- `pinokio.js` - Main configuration
- `install.js` - Installation script (clones from GitHub repository)
- `start.js` - Startup script
- `torch.js` - PyTorch installation with latest optimizations
- `update.js` - Update script
- `reset.js` - Reset script
- `smollm3_gradio.py` - Reference Gradio application
- `icon.png` - Project icon

### 2. Installation Process

The installation process:
1. Clones the SmolLM3-3B-Pinokio repository from GitHub
2. Creates `app/` directory with the cloned repository
3. Installs PyTorch 2.7.0 with GPU support (CUDA 12.8, DirectML, ROCm)
4. Installs transformers, gradio, accelerate, bitsandbytes, and other dependencies
5. Sets up virtual environment with all dependencies
6. Verifies installation with component tests

### 3. Repository Integration

The package now clones from:
```
https://github.com/PierrunoYT/SmolLM3-3B-Pinokio-Gradio
```

This ensures:
- Always up-to-date application code
- Proper requirements.txt handling
- Access to the latest Gradio interface
- Automatic model configuration

### 4. Distribution Files

For the Pinokio package, distribute these files:
- `pinokio.js` - Main configuration
- `install.js` - Installation script (clones repository)
- `start.js` - Startup script
- `torch.js` - PyTorch installation
- `update.js` - Update script
- `reset.js` - Reset script
- `smollm3_gradio.py` - Reference Gradio application
- `icon.png` - Project icon
- `README.md` - Documentation
- `PINOKIO_PACKAGE_README.md` - Package documentation
- `SETUP_INSTRUCTIONS.md` - This file
- `.gitignore` - Git ignore rules

### 5. How It Works

1. User installs the Pinokio package (files above)
2. When they click "Install SmolLM3-3B", it:
   - Clones the repository to `app/` directory
   - Installs PyTorch with platform-specific optimizations
   - Installs all Python dependencies using UV package manager
   - Verifies the installation
3. The SmolLM3-3B model downloads automatically on first use (~6GB)
4. User can then start the application through Pinokio interface
5. Gradio web interface becomes available for chatting

### 6. Key Features

- **Repository-based**: Always gets latest code from GitHub
- **Fast Installation**: Uses UV package manager for lightning-fast dependency installation
- **GPU Optimization**: Supports NVIDIA CUDA, AMD DirectML/ROCm, and CPU fallback
- **Cross-Platform**: Windows, macOS, and Linux support
- **Advanced Features**: XFormers, Triton, and SageAttention optimizations
- **Extended Thinking**: SmolLM3's reasoning mode support

### 7. Technical Details

**PyTorch Installation:**
- Windows NVIDIA: CUDA 12.8 + XFormers + Triton + SageAttention
- Windows AMD: DirectML support
- Linux NVIDIA: CUDA 12.8 + XFormers + SageAttention
- Linux AMD: ROCm 6.2.4 support
- macOS: CPU + Metal acceleration
- CPU fallback: Optimized CPU-only installation

**Dependencies:**
- transformers>=4.40.0
- gradio>=4.0.0
- accelerate
- bitsandbytes
- torch 2.7.0+

This approach ensures a robust, up-to-date installation that leverages the latest optimizations and always has access to the most current application code.