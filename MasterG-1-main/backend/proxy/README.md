# NLLB-200 Translation Service

This directory contains the NLLB-200 (No Language Left Behind) translation service for MasterG. It provides high-quality, offline translation for 200+ languages.

## 🚀 Quick Setup

### Windows

```bash
# Run the setup script (one-time setup)
setup_nllb.bat
```

### Linux/Mac

```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Download NLLB-200 model (~2.4GB)
python setup_models.py
```

## 📋 Requirements

- **Python**: 3.8 or higher
- **Disk Space**: ~5GB (2.4GB model + dependencies)
- **RAM**: 4GB minimum, 8GB recommended
- **Internet**: Required for initial download only

## 🔧 Configuration

The NLLB service is configured in `backend/src/config/env.ts`:

```typescript
NLLB_ENABLED: true,  // Enable/disable NLLB translation
PYTHON_EXECUTABLE: "python",  // Python executable path
```

### Environment Variables

You can override the default paths using environment variables:

```bash
# Custom model directory
NLLB_MODELS_DIR=/path/to/models

# Custom model path
NLLB_MODEL_PATH=/path/to/models/nllb-200-distilled-600M
```

## 📁 Directory Structure

```
proxy/
├── nllb_server.py          # Main NLLB translation server
├── setup_models.py         # Model download script
├── requirements.txt        # Python dependencies
├── setup_nllb.bat         # Windows setup script
├── nllb_test.py           # Test script
├── venv/                  # Python virtual environment (created during setup)
└── models/                # Downloaded models (created during setup)
    └── nllb-200-distilled-600M/
        ├── config.json
        ├── tokenizer.json
        ├── sentencepiece.bpe.model
        └── pytorch_model.bin (or model.safetensors)
```

## 🎯 Features

### Offline Translation
- **No Internet Required**: After initial setup, runs completely offline
- **200+ Languages**: Supports all major world languages
- **High Quality**: State-of-the-art neural machine translation

### Performance Optimizations
- **Persistent Server**: Model loaded once, reused for all requests
- **Batch Processing**: Translates multiple sentences at once (3-5x speedup)
- **GPU Acceleration**: Automatically uses CUDA/MPS if available
- **CPU Optimization**: INT8 quantization for 2-3x CPU speedup
- **Smart Caching**: Caches translations to avoid redundant work

### LaTeX Preservation
- **Math Formulas**: Preserves LaTeX math ($...$ and $$...$$) during translation
- **Markdown Stripping**: Removes markdown formatting before translation
- **Content Integrity**: Ensures formulas render correctly after translation

## 🧪 Testing

### Test the NLLB Server

```bash
# Activate virtual environment
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac

# Run test script
python nllb_test.py
```

### Test from Backend

```bash
# Start backend server
cd ..
npm run dev

# The NLLB server will start automatically
# Check logs for: "✅ NLLB-200 model loaded and ready!"
```

## 🌍 Supported Languages

NLLB-200 supports 200+ languages. Common language codes:

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

For a complete list, see: [NLLB Language Codes](https://github.com/facebookresearch/flores/blob/main/flores200/README.md#languages-in-flores-200)

## 🔌 API Usage

### From TypeScript (Backend)

```typescript
import { nllbService } from './services/nllb.service';

// Translate text
const translated = await nllbService.translate(
  "Hello, how are you?",
  {
    srcLang: "eng_Latn",
    tgtLang: "hin_Deva",
    batchSize: 8,  // Optional: auto-detected based on CPU/GPU
    useCache: true  // Optional: default true
  }
);

console.log(translated);  // "नमस्ते, आप कैसे हैं?"
```

### Direct Python API

```python
import json
import sys

# Send request to stdin
request = {
    "text": "Hello, how are you?",
    "src_lang": "eng_Latn",
    "tgt_lang": "hin_Deva",
    "batch_size": 8  # Optional
}

print(json.dumps(request))
sys.stdout.flush()

# Read response from stdout
response = json.loads(sys.stdin.readline())
print(response["translated"])
```

## 🐛 Troubleshooting

### Model Not Found

```
❌ NLLB model path does not exist
```

**Solution**: Run the setup script again:
```bash
python setup_models.py
```

### Virtual Environment Not Found

```
⚠️ NLLB venv not found, using python3
```

**Solution**: Create the virtual environment:
```bash
python -m venv venv
```

### PyTorch Not Installed

```
❌ Failed to import 'torch'
```

**Solution**: Install dependencies:
```bash
pip install -r requirements.txt
```

### Out of Memory

```
RuntimeError: CUDA out of memory
```

**Solution**: The model will automatically fall back to CPU. If CPU also runs out of memory, try:
1. Close other applications
2. Reduce batch size in requests
3. Use a smaller model variant (if available)

### Slow Translation

**CPU Mode**: Translation on CPU is slower than GPU. Optimizations:
- INT8 quantization is automatically applied (2-3x speedup)
- Batch processing is enabled (processes multiple sentences at once)
- Parallel batch processing for multi-core CPUs

**GPU Mode**: Ensure CUDA/MPS is properly installed:
```bash
# Check GPU availability
python -c "import torch; print(torch.cuda.is_available())"
```

## 📊 Performance

### Translation Speed (Approximate)

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

## 🔒 Security

- **Offline Operation**: No data sent to external servers
- **Local Processing**: All translation happens on your machine
- **Privacy**: Your data never leaves your system

## 📝 License

NLLB-200 is released by Meta AI under the CC-BY-NC 4.0 license.
See: https://github.com/facebookresearch/fairseq/tree/nllb

## 🤝 Contributing

To improve the NLLB service:

1. **Performance**: Optimize batch processing or quantization
2. **Features**: Add streaming translation or language detection
3. **Documentation**: Improve setup instructions or troubleshooting

## 📚 References

- [NLLB Paper](https://arxiv.org/abs/2207.04672)
- [NLLB GitHub](https://github.com/facebookresearch/fairseq/tree/nllb)
- [Hugging Face Model](https://huggingface.co/facebook/nllb-200-distilled-600M)
- [Language Codes](https://github.com/facebookresearch/flores/blob/main/flores200/README.md)
