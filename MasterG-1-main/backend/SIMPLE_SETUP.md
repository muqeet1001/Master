# Simple NLLB Setup - Just 2 Steps!

## First Time Setup (Run Once)

### Option 1: Automatic Setup (Recommended)

Just run this script **once**:

```bash
setup-nllb-once.bat
```

This will:
- Create Python virtual environment
- Install all dependencies (5-10 minutes)
- Download NLLB model (~2.4GB)

### Option 2: Let npm do it

Just run:

```bash
npm run dev
```

The first time you run this, it will:
- Check if dependencies are installed
- Install them automatically if missing
- Then start the server

**Note**: You'll still need to download the model manually:
```bash
cd proxy
venv\Scripts\activate
python setup_models.py
```

## After First Setup

Just run:

```bash
npm run dev
```

That's it! NLLB will start automatically every time.

## What Happens

When you run `npm run dev`:

1. ✅ Checks if Python virtual environment exists
2. ✅ Checks if dependencies are installed
3. ✅ Installs missing dependencies automatically
4. ✅ Starts the backend server
5. ✅ NLLB server starts automatically

You'll see:
```
🔍 Checking NLLB setup...
✅ PyTorch installed
✅ Transformers installed
✅ All Python dependencies installed
✅ NLLB model found
🚀 Starting backend server...

Server running on port 5001
🚀 Starting NLLB-200 persistent server...
✅ NLLB-200 model loaded and ready!
```

## Troubleshooting

### First run is slow
- Normal! Installing PyTorch takes 5-10 minutes
- Only happens once

### "Model not found"
Run the one-time setup:
```bash
setup-nllb-once.bat
```

### Still having issues?
Check the detailed guide: `NLLB_SETUP.md`

## That's It!

After the first setup, just use `npm run dev` and everything works automatically! 🎉
