# Install NLLB Dependencies - Step by Step

## Issue
The NLLB server is crashing because Python dependencies (PyTorch, Transformers) are not installed in the virtual environment.

## Solution

Follow these steps to install the dependencies:

### Step 1: Open PowerShell/Command Prompt

Open a terminal in the `MasterG/backend/proxy` directory.

### Step 2: Activate Virtual Environment

```powershell
# Windows PowerShell
.\venv\Scripts\Activate.ps1

# OR Windows CMD
venv\Scripts\activate.bat
```

You should see `(venv)` in your prompt.

### Step 3: Upgrade pip

```powershell
python -m pip install --upgrade pip
```

### Step 4: Install Dependencies

This will take 5-10 minutes (PyTorch is ~113MB):

```powershell
pip install torch>=2.6.0 transformers>=4.51.0 huggingface_hub>=0.26.0 numpy>=2.1.0 protobuf>=3.20.0 accelerate>=1.12.0
```

**Wait for this to complete!** You'll see progress bars for each package.

### Step 5: Verify Installation

```powershell
python check_setup.py
```

You should see all dependencies marked with ✓.

### Step 6: Test NLLB

```powershell
python nllb_test.py
```

You should see a translation from English to French.

### Step 7: Start Backend

```powershell
cd ..
npm run dev
```

You should now see:
```
🚀 Starting NLLB-200 persistent server...
Loading NLLB-200 model from ...
✅ NLLB-200 model loaded and ready!
Server running on port 5001
```

## Quick Fix Script

Alternatively, run the automated fix script:

```powershell
cd MasterG\backend\proxy
.\fix_setup.bat
```

This will:
1. Activate virtual environment
2. Upgrade pip
3. Install all dependencies
4. Verify installation

## Troubleshooting

### "Execution of scripts is disabled"

If you get this error when activating the virtual environment:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then try activating again.

### Installation Fails

If pip install fails:

1. Check internet connection
2. Try running PowerShell as Administrator
3. Check if antivirus is blocking
4. Try installing packages one by one:
   ```powershell
   pip install torch
   pip install transformers
   pip install huggingface_hub
   pip install numpy
   pip install protobuf
   pip install accelerate
   ```

### Still Getting "Module Not Found"

Make sure you're using the virtual environment's Python:

```powershell
# Check which Python you're using
where python

# Should show: B:\Master\MasterG\backend\proxy\venv\Scripts\python.exe
```

If not, activate the virtual environment again.

## What's Happening

The NLLB service needs these Python packages:
- **torch** (PyTorch): Deep learning framework (~113MB)
- **transformers**: Hugging Face library for NLP models
- **huggingface_hub**: Model downloading and management
- **numpy**: Numerical computing
- **protobuf**: Data serialization
- **accelerate**: Model optimization

These were not installed when the virtual environment was created, causing the "ModuleNotFoundError: No module named 'torch'" error.

## After Installation

Once dependencies are installed:
1. The NLLB server will start automatically with the backend
2. Translation will work offline (no internet needed)
3. First translation may be slow (model loading)
4. Subsequent translations will be fast (model cached in memory)

## Need Help?

If you're still having issues:
1. Check `proxy/error.log` for Python errors
2. Run `python check_setup.py` to diagnose
3. Ensure virtual environment is activated
4. Make sure you're in the `proxy` directory
