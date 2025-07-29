# SmolLM3-3B Chatbot - Pinokio Package

This directory contains a complete Pinokio installer package for SmolLM3-3B Chatbot, a local AI chatbot with a beautiful Gradio web interface for natural language conversations.

## Package Contents

### Core Pinokio Files
- **`pinokio.js`** - Main configuration and dynamic menu system
- **`install.js`** - Complete installation workflow
- **`start.js`** - Application startup script with port management
- **`torch.js`** - Cross-platform PyTorch installation
- **`update.js`** - Update workflow for package and dependencies
- **`reset.js`** - Clean removal and reset functionality
- **`icon.png`** - Project icon (512x512px robot/AI design)

### Additional Files
- **`smollm3_gradio.py`** - Complete Gradio application
- **`ICON_INSTRUCTIONS.md`** - Instructions for customizing the icon
- **`PINOKIO_PACKAGE_README.md`** - This documentation file

## Installation Process

The Pinokio installer will:

1. **Create App Directory**: Sets up isolated `app/` directory
2. **Install PyTorch**: Platform and GPU-specific PyTorch installation
3. **Install Dependencies**: Installs transformers, gradio, and supporting packages
4. **Copy Gradio App**: Copies the SmolLM3 Gradio interface to app directory
5. **Setup Environment**: Creates virtual environment with all dependencies
6. **Model Preparation**: Prepares for automatic model download on first use

## Features

### Smart Menu System
- **Dynamic State Detection**: Shows appropriate options based on installation status
- **Running Process Awareness**: Detects if installation/startup is in progress
- **Direct Web Access**: "Open SmolLM3 Chatbot" button when application is running
- **Terminal Access**: View logs and output during operation

### Cross-Platform Support
- **Windows**: Full support with CUDA/DirectML/CPU modes
- **macOS**: Native support for Intel and Apple Silicon with Metal acceleration
- **Linux**: Ubuntu/Debian and other distributions with CUDA/ROCm support

### GPU Optimization
- **NVIDIA CUDA**: Automatic detection and installation of CUDA 12.8
- **AMD Support**: DirectML on Windows, ROCm on Linux
- **CPU Fallback**: Graceful fallback to CPU-only mode with optimizations
- **Memory Management**: Automatic FP16/FP32 precision selection

### AI Features
- **SmolLM3-3B Model**: Advanced 3B parameter language model
- **Extended Thinking Mode**: Enable reasoning traces for complex queries
- **Parameter Control**: Adjustable temperature, top-p, and token limits
- **Real-time Chat**: Responsive conversational interface

### Robust Installation
- **Error Handling**: Graceful handling of installation failures
- **Dependency Management**: Proper virtual environment isolation
- **Update Support**: Easy updates without full reinstallation
- **Clean Reset**: Complete removal for fresh starts

## Usage Instructions

### For End Users
1. Copy this entire directory to your Pinokio packages folder
2. Launch Pinokio and find "SmolLM3-3B Chatbot" in your packages
3. Click "Install" to begin the installation process
4. After installation, click "Start" to launch the application
5. Click "Open SmolLM3 Chatbot" to access the Gradio interface

### For Developers
1. Ensure all source files are in the same directory as the Pinokio scripts
2. Test the installation process in a clean environment
3. Verify cross-platform compatibility
4. Update version numbers in `pinokio.js` as needed

## System Requirements

### Minimum Requirements
- **OS**: Windows 10/11, macOS 10.15+, or Linux
- **RAM**: 8GB (12GB+ recommended)
- **Storage**: 10GB free space
- **Python**: 3.9+ (installed automatically in virtual environment)

### Recommended for Optimal Performance
- **GPU**: NVIDIA RTX 3070 or better with 8GB+ VRAM
- **RAM**: 16GB or more
- **Storage**: SSD with 15GB+ free space
- **Internet**: Stable connection for model downloads (~6GB)

## Model Information

The application uses the SmolLM3-3B model:
- **Model**: HuggingFaceTB/SmolLM3-3B
- **Parameters**: 3 billion
- **Context Length**: Up to 8192 tokens
- **License**: Apache 2.0
- **Download**: Automatic on first use (~6GB)

## Troubleshooting

### Common Issues
1. **Installation Fails**: Check internet connection and disk space
2. **PyTorch Issues**: Verify CUDA compatibility or use CPU mode
3. **Model Download Fails**: Check internet connection, model downloads automatically
4. **Memory Issues**: Reduce max tokens or use CPU mode
5. **Port Conflicts**: Pinokio automatically finds available ports
6. **Slow Responses**: Normal on CPU, consider GPU acceleration

### Debug Information
- Installation logs are available in Pinokio terminal
- Application logs shown during startup
- Error messages include helpful troubleshooting hints
- Reset option available for clean reinstallation

## Technical Details

### Virtual Environment
- Isolated Python environment in `app/env/`
- All dependencies installed within virtual environment
- No conflicts with system Python installation

### Model Management
- SmolLM3-3B model downloaded automatically on first run
- Cached locally for subsequent uses
- Approximately 6GB download on first initialization
- Uses HuggingFace transformers library

### Port Management
- Automatic port detection and assignment
- Default port 7860 with fallback options
- Accessible via localhost and network interfaces

### GPU Support Matrix

| Platform | NVIDIA | AMD | CPU |
|----------|--------|-----|-----|
| Windows | CUDA 12.8 + XFormers | DirectML | CPU-only |
| Linux | CUDA 12.8 + XFormers + SageAttention | ROCm 6.2.4 | CPU-only |
| macOS | N/A | N/A | CPU + Metal |

## Version History

- **v1.0.0**: Initial Pinokio package release
  - Complete installation workflow for SmolLM3-3B
  - Cross-platform PyTorch support with latest optimizations
  - Dynamic menu system
  - Professional Gradio interface with extended thinking mode

## Support

For issues related to:
- **Pinokio Package**: Check this documentation and Pinokio logs
- **SmolLM3 Model**: Visit [HuggingFace model page](https://huggingface.co/HuggingFaceTB/SmolLM3-3B)
- **Installation Problems**: Use the Reset option and try reinstalling
- **Performance Issues**: Check system requirements and GPU compatibility

## License

This Pinokio package is provided under the MIT License. The underlying SmolLM3-3B model is licensed under Apache 2.0 by HuggingFace - please refer to the official model page for details.