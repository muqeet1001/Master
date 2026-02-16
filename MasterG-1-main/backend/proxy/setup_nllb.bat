@echo off
REM ============================================================================
REM NLLB-200 Setup Script for MasterG Backend (Windows)
REM ============================================================================
REM This script sets up the NLLB-200 translation model for offline use.
REM Run this ONCE to download and configure the model (~2.4GB download).
REM ============================================================================

echo.
echo ============================================================================
echo MasterG NLLB-200 Translation Setup
echo ============================================================================
echo.
echo This will:
echo   1. Create a Python virtual environment
echo   2. Install required dependencies (PyTorch, Transformers)
echo   3. Download NLLB-200 model (~2.4GB) for offline use
echo.
echo Requirements:
echo   - Python 3.8+ installed
echo   - Internet connection (for initial download only)
echo   - ~5GB free disk space
echo.
pause

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8+ from https://www.python.org/downloads/
    echo.
    pause
    exit /b 1
)

echo.
echo [1/4] Creating Python virtual environment...
echo.

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    python -m venv venv
    if errorlevel 1 (
        echo ERROR: Failed to create virtual environment
        pause
        exit /b 1
    )
    echo Virtual environment created successfully
) else (
    echo Virtual environment already exists
)

echo.
echo [2/4] Activating virtual environment...
echo.

REM Activate virtual environment
call venv\Scripts\activate.bat
if errorlevel 1 (
    echo ERROR: Failed to activate virtual environment
    pause
    exit /b 1
)

echo.
echo [3/4] Installing Python dependencies...
echo This may take a few minutes...
echo.

REM Upgrade pip first
python -m pip install --upgrade pip

REM Install dependencies
pip install -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo [4/4] Downloading NLLB-200 model...
echo This will download ~2.4GB and may take 5-10 minutes...
echo.

REM Download the model
python setup_models.py
if errorlevel 1 (
    echo.
    echo ERROR: Model download failed
    echo.
    echo Troubleshooting:
    echo   1. Check your internet connection
    echo   2. Ensure you have ~5GB free disk space
    echo   3. For gated models, run: huggingface-cli login
    echo.
    pause
    exit /b 1
)

echo.
echo ============================================================================
echo SUCCESS! NLLB-200 is now set up and ready to use
echo ============================================================================
echo.
echo The model is stored locally and will run completely offline.
echo No internet connection is required for translation.
echo.
echo Next steps:
echo   1. Ensure NLLB_ENABLED=true in backend/.env
echo   2. Start the backend server: npm run dev
echo   3. The NLLB server will start automatically
echo.
echo To test the setup, run:
echo   venv\Scripts\activate
echo   python nllb_test.py
echo.
pause
