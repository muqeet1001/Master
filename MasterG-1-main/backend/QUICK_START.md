# MasterG Backend - Quick Start Guide

Get up and running with MasterG backend in 5 minutes!

## ⚡ Quick Setup (5 minutes)

### 1. Install Dependencies (1 min)

```bash
npm install
```

### 2. Setup NLLB Translation (2 min)

```bash
cd proxy
setup_nllb.bat  # Windows
# OR
./setup_nllb.sh  # Linux/Mac
cd ..
```

### 3. Configure Environment (1 min)

```bash
cp .env.example .env
```

Edit `.env`:
```env
NLLB_ENABLED=true
MONGODB_URI=mongodb://localhost:27017/masterg
CHROMA_URL=http://localhost:8000
OLLAMA_URL=http://localhost:11434
```

### 4. Start Services (1 min)

**Terminal 1 - ChromaDB:**
```bash
chroma run --host localhost --port 8000
```

**Terminal 2 - Ollama:**
```bash
ollama serve
```

**Terminal 3 - Backend:**
```bash
npm run dev
```

### 5. Verify (30 sec)

```bash
curl http://localhost:5001/api/query/health
```

✅ You should see: `{"status": "ok"}`

## 🎯 Common Commands

### Development

```bash
npm run dev          # Start dev server with hot reload
npm run build        # Build for production
npm start            # Start production server
```

### NLLB Translation

```bash
cd proxy
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

python verify_setup.py    # Verify NLLB setup
python nllb_test.py       # Test translation
```

### Testing

```bash
# Health check
curl http://localhost:5001/api/query/health

# Translate text
curl -X POST http://localhost:5001/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello","srcLang":"eng_Latn","tgtLang":"hin_Deva"}'
```

## 🔧 Minimal Setup (No NLLB)

If you want to skip NLLB translation:

```bash
# 1. Install dependencies
npm install

# 2. Configure .env
cp .env.example .env
# Set: NLLB_ENABLED=false

# 3. Start services
chroma run --host localhost --port 8000  # Terminal 1
ollama serve                              # Terminal 2
npm run dev                               # Terminal 3
```

## 🐛 Quick Troubleshooting

### "NLLB model not found"
```bash
cd proxy
python setup_models.py
```

### "Port 5001 already in use"
```bash
# Change PORT in .env
PORT=5002
```

### "ChromaDB connection failed"
```bash
chroma run --host localhost --port 8000
```

### "Ollama not available"
```bash
ollama serve
ollama pull deepseek-r1:1.5b
```

## 📚 Next Steps

- [Full Setup Guide](./README.md) - Detailed documentation
- [NLLB Setup](./NLLB_SETUP.md) - Translation service setup
- [Proxy README](./proxy/README.md) - Python services

## 🆘 Need Help?

1. Check [README.md](./README.md) for detailed docs
2. Review [NLLB_SETUP.md](./NLLB_SETUP.md) for translation issues
3. Check logs in `proxy/error.log`
4. Open an issue on GitHub
