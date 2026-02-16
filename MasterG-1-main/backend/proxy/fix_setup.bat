@echo off
REM ============================================================================
REM NLLB-200 Quick Fix Script
REM ============================================================================
REM This script fixes common setup issues with NLLB-200
REM ============================================================================

echo.
echo ============================================================================
echo NLLB-200 Quick Fix
echo ============================================================================
echo.

REM Check if virtual environment exists
if not exist "venv" (
    echo ERROR: Virtual environment not found
    echo Please run setup_nllb.bat first
    pause
    exit /b 1
)

echo [1/3] Activating virtual environment...
call venv\Scripts\activate.bat
if errorlevel 1 (
    echo ERROR: Failed to activate virtual environment
    pause
    exit /b 1
)

echo.
echo [2/3] Upgrading pip...
python -m pip install --upgrade pip

echo.
echo [3/3] Installing/Reinstalling dependencies...
echo This may take a few minutes...
echo.

REM Install dependencies
pip install --upgrade -r requirements.txt
if errorlevel 1 (
    echo.
    echo ERROR: Failed to install dependencies
    echo.
    echo Troubleshooting:
    echo   1. Check your internet connection
    echo   2. Try running as administrator
    echo   3. Check if antivirus is blocking
    echo.
    pause
    exit /b 1
)

echo.
echo ============================================================================
echo Dependencies installed successfully!
echo ============================================================================
echo.
echo Verifying installation...
echo.

REM Verify torch installation
python -c "import torch; print(f'PyTorch {torch.__version__} installed successfully')"
if errorlevel 1 (
    echo.
    echo ERROR: PyTorch verification failed
    pause
    exit /b 1
)

REM Verify transformers installation
python -c "import transformers; print(f'Transformers {transformers.__version__} installed successfully')"
if errorlevel 1 (
    echo.
    echo ERROR: Transformers verification failed
    pause
    exit /b 1
)

echo.
echo ============================================================================
echo SUCCESS! Dependencies are now installed
echo ============================================================================
echo.
echo Next steps:
echo   1. Download the NLLB model: python setup_models.py
echo   2. Verify setup: python verify_setup.py
echo   3. Start backend: cd .. ^&^& npm run dev
echo.
pause
