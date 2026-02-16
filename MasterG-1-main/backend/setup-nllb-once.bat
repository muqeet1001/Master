@echo off
REM ============================================================================
REM One-Time NLLB Setup - Run this once to set up everything
REM ============================================================================

echo.
echo ============================================================================
echo NLLB-200 One-Time Setup
echo ============================================================================
echo.
echo This will:
echo   1. Create Python virtual environment
echo   2. Install Python dependencies (PyTorch, Transformers)
echo   3. Download NLLB model (~2.4GB)
echo.
echo This only needs to be run ONCE.
echo After this, just use: npm run dev
echo.
pause

cd proxy

echo.
echo [1/3] Setting up Python environment...
echo.

REM Create venv if not exists
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
    if errorlevel 1 (
        echo ERROR: Failed to create virtual environment
        echo Make sure Python 3.8+ is installed
        pause
        exit /b 1
    )
)

REM Activate venv
call venv\Scripts\activate.bat

echo.
echo [2/3] Installing Python dependencies...
echo This may take 5-10 minutes...
echo.

REM Upgrade pip
python -m pip install --upgrade pip

REM Install requirements
pip install -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo [3/3] Downloading NLLB model...
echo This will download ~2.4GB...
echo.

python setup_models.py
if errorlevel 1 (
    echo ERROR: Failed to download model
    pause
    exit /b 1
)

echo.
echo ============================================================================
echo SUCCESS! NLLB is now fully set up
echo ============================================================================
echo.
echo You can now start the backend with: npm run dev
echo NLLB will start automatically!
echo.
pause
