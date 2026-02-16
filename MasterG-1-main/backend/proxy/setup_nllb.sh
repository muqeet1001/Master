#!/bin/bash
# ============================================================================
# NLLB-200 Setup Script for MasterG Backend (Linux/Mac)
# ============================================================================
# This script sets up the NLLB-200 translation model for offline use.
# Run this ONCE to download and configure the model (~2.4GB download).
# ============================================================================

echo ""
echo "============================================================================"
echo "MasterG NLLB-200 Translation Setup"
echo "============================================================================"
echo ""
echo "This will:"
echo "  1. Create a Python virtual environment"
echo "  2. Install required dependencies (PyTorch, Transformers)"
echo "  3. Download NLLB-200 model (~2.4GB) for offline use"
echo ""
echo "Requirements:"
echo "  - Python 3.8+ installed"
echo "  - Internet connection (for initial download only)"
echo "  - ~5GB free disk space"
echo ""
read -p "Press Enter to continue..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo ""
    echo "ERROR: Python 3 is not installed or not in PATH"
    echo "Please install Python 3.8+ from https://www.python.org/downloads/"
    echo ""
    exit 1
fi

echo ""
echo "[1/4] Creating Python virtual environment..."
echo ""

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    python3 -m venv venv
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to create virtual environment"
        exit 1
    fi
    echo "Virtual environment created successfully"
else
    echo "Virtual environment already exists"
fi

echo ""
echo "[2/4] Activating virtual environment..."
echo ""

# Activate virtual environment
source venv/bin/activate
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to activate virtual environment"
    exit 1
fi

echo ""
echo "[3/4] Installing Python dependencies..."
echo "This may take a few minutes..."
echo ""

# Upgrade pip first
python -m pip install --upgrade pip

# Install dependencies
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install dependencies"
    exit 1
fi

echo ""
echo "[4/4] Downloading NLLB-200 model..."
echo "This will download ~2.4GB and may take 5-10 minutes..."
echo ""

# Download the model
python setup_models.py
if [ $? -ne 0 ]; then
    echo ""
    echo "ERROR: Model download failed"
    echo ""
    echo "Troubleshooting:"
    echo "  1. Check your internet connection"
    echo "  2. Ensure you have ~5GB free disk space"
    echo "  3. For gated models, run: huggingface-cli login"
    echo ""
    exit 1
fi

echo ""
echo "============================================================================"
echo "SUCCESS! NLLB-200 is now set up and ready to use"
echo "============================================================================"
echo ""
echo "The model is stored locally and will run completely offline."
echo "No internet connection is required for translation."
echo ""
echo "Next steps:"
echo "  1. Ensure NLLB_ENABLED=true in backend/.env"
echo "  2. Start the backend server: npm run dev"
echo "  3. The NLLB server will start automatically"
echo ""
echo "To test the setup, run:"
echo "  source venv/bin/activate"
echo "  python nllb_test.py"
echo ""
