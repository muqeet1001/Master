# NLLB-200 Translation Setup Guide

This guide will help you set up the NLLB-200 translation service for MasterG backend.

## 🎯 What is NLLB-200?

NLLB-200 (No Language Left Behind) is Meta AI's state-of-the-art translation model that supports 200+ languages. It provides:

- **High-quality translation** for 200+ languages
- **Completely offline** operation (no internet required after setup)
- **Fast performance** with GPU/CPU optimization
- **Privacy-focused** - all data stays on your machine

## 🚀 Quick Setup

### Step 1: Navigate to Proxy Directory

```bash
cd backend/proxy
```

### Step 2: Run Setup Script

**Windows:**
```bash
setup_nllb.bat
```

**Linux/Mac:**
```bash
chmod +x setup_nllb.sh
./setup_nllb.sh
```

### Step 3: Configure Environment

Create a `.env` file in the `backend` directory (if not exists):

```bash
cd ..
cp .env.example .env
```

Ensure these settings in `.env`:

```env
NLLB_ENABLED=true
PYTHON_EXECUTABLE=python
```

### Step 4: Start Backend

```bash
npm run dev
```

You should see:
```
🚀 Starting NLLB-200 persistent server...
Loading NLLB-200 model from ...
✅ NLLB-200 model loaded and ready!
```

## 📋 Requirements

- **Python**: 3.8 or higher
- **Node.js**: 16 or higher
- **Disk Space**: ~5GB (2.4GB model + dependencies)
- **RAM**: 4GB minimum, 8GB recommended
- **Internet**: Required for initial download only

## 🔧 Manual Setup (Alternative)

If the automated script doesn't work, follow these steps:

### 1. Create Virtual Environment

```bash
cd backend/proxy

# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### 3. Download Model

```bash
python setup_models.py
```

This will download the NLLB-200 model (~2.4GB) to `proxy/models/nllb-200-distilled-600M/`.

### 4. Verify Installation

```bash
python nllb_test.py
```

You should see a translation from English to French.

## 🧪 Testing

### Test NLLB Server Directly

```bash
cd backend/proxy
source venv/bin/activate  # or venv\Scripts\activate on Windows
python nllb_test.py
```

Expected output:
```
Loading model...
Running on: CPU (or GPU)
Original: Hello, how are you?
Translated: Bonjour, comment allez-vous?
```

### Test from Backend API

Start the backend server and use the translation endpoint:

```bash
curl -X POST http://localhost:5001/api/translate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello, how are you?",
    "srcLang": "eng_Latn",
    "tgtLang": "hin_Deva"
  }'
```

## 🌍 Language Codes

NLLB uses specific language codes. Common examples:

| Language | Code |
|----------|------|
| English | `eng_Latn` |
| Hindi | `hin_Deva` |
| Spanish | `spa_Latn` |
| French | `fra_Latn` |
| German | `deu_Latn` |
| Chinese (Simplified) | `zho_Hans` |
| Arabic | `arb_Arab` |
| Japanese | `jpn_Jpan` |
| Korean | `kor_Hang` |
| Russian | `rus_Cyrl` |
| Bengali | `ben_Beng` |
| Tamil | `tam_Taml` |
| Telugu | `tel_Telu` |
| Marathi | `mar_Deva` |
| Gujarati | `guj_Gujr` |

For a complete list: [NLLB Language Codes](https://github.com/facebookresearch/flores/blob/main/flores200/README.md#languages-in-flores-200)

## 🐛 Troubleshooting

### Issue: "NLLB model path does not exist"

**Solution**: Run the setup script again or manually download the model:
```bash
cd backend/proxy
python setup_models.py
```

### Issue: "Failed to import 'torch'"

**Solution**: Install PyTorch:
```bash
pip install torch>=2.6.0
```

### Issue: "NLLB venv not found"

**Solution**: Create the virtual environment:
```bash
cd backend/proxy
python -m venv venv
```

### Issue: Slow translation on CPU

**Expected**: CPU translation is slower than GPU. The service automatically applies optimizations:
- INT8 quantization (2-3x speedup)
- Batch processing
- Parallel processing for multi-core CPUs

**To improve**: Use a GPU if available (CUDA or Apple Silicon MPS).

### Issue: Out of memory

**Solution**:
1. Close other applications
2. Reduce batch size in translation requests
3. Restart the backend server

### Issue: Model download fails

**Solution**:
1. Check internet connection
2. Ensure ~5GB free disk space
3. For gated models, login to Hugging Face:
   ```bash
   pip install huggingface-hub
   huggingface-cli login
   ```

## 📊 Performance

### Translation Speed

| Hardware | Speed | Notes |
|----------|-------|-------|
| CPU (8 cores) | ~2-5 sentences/sec | With INT8 quantization |
| GPU (CUDA) | ~10-20 sentences/sec | With batch processing |
| GPU (Apple Silicon) | ~8-15 sentences/sec | MPS acceleration |

### Memory Usage

| Component | RAM | VRAM (GPU) |
|-----------|-----|------------|
| Model (FP32) | ~2.4GB | ~2.4GB |
| Model (INT8) | ~1.2GB | N/A |
| Overhead | ~500MB | ~200MB |

## 🔌 Usage in Code

### TypeScript (Backend)

```typescript
import { nllbService } from './services/nllb.service';

// Translate text
const translated = await nllbService.translate(
  "Hello, how are you?",
  {
    srcLang: "eng_Latn",
    tgtLang: "hin_Deva",
    batchSize: 8,  // Optional: auto-detected
    useCache: true  // Optional: default true
  }
);

console.log(translated);  // "नमस्ते, आप कैसे हैं?"
```

### Python (Direct)

```python
import json
import subprocess

# Start NLLB server
process = subprocess.Popen(
    ["python", "nllb_server.py"],
    stdin=subprocess.PIPE,
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    text=True
)

# Send translation request
request = {
    "text": "Hello, how are you?",
    "src_lang": "eng_Latn",
    "tgt_lang": "hin_Deva"
}

process.stdin.write(json.dumps(request) + "\n")
process.stdin.flush()

# Read response
response = json.loads(process.stdout.readline())
print(response["translated"])
```

## 🔒 Security & Privacy

- **Offline Operation**: No data sent to external servers
- **Local Processing**: All translation happens on your machine
- **Privacy**: Your data never leaves your system
- **No Telemetry**: No usage tracking or analytics

## 📚 Additional Resources

- [NLLB Paper](https://arxiv.org/abs/2207.04672)
- [NLLB GitHub](https://github.com/facebookresearch/fairseq/tree/nllb)
- [Hugging Face Model](https://huggingface.co/facebook/nllb-200-distilled-600M)
- [Proxy README](./proxy/README.md) - Detailed technical documentation

## 🤝 Support

If you encounter issues:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Review logs in `backend/proxy/error.log`
3. Check backend console for NLLB-related messages
4. Ensure all requirements are met

## 📝 License

NLLB-200 is released by Meta AI under the CC-BY-NC 4.0 license.
