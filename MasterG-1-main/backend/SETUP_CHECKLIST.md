# NLLB-200 Setup Checklist

Use this checklist to ensure your NLLB-200 translation service is properly set up.

## ✅ Pre-Setup Checklist

### System Requirements
- [ ] Python 3.8+ installed (`python --version`)
- [ ] Node.js 16+ installed (`node --version`)
- [ ] ~5GB free disk space
- [ ] Internet connection (for initial download only)

### Optional (Recommended)
- [ ] GPU with CUDA support (for faster translation)
- [ ] 8GB+ RAM (4GB minimum)
- [ ] MongoDB installed (for chat history)
- [ ] ChromaDB installed (for vector storage)
- [ ] Ollama installed (for local AI)

## 📦 Installation Checklist

### 1. Backend Dependencies
- [ ] Navigate to `backend` directory
- [ ] Run `npm install`
- [ ] Verify no errors in installation

### 2. NLLB Setup
- [ ] Navigate to `backend/proxy` directory
- [ ] Run setup script:
  - [ ] Windows: `setup_nllb.bat`
  - [ ] Linux/Mac: `./setup_nllb.sh`
- [ ] Wait for model download (~2.4GB)
- [ ] Verify "SUCCESS!" message

### 3. Environment Configuration
- [ ] Copy `.env.example` to `.env`
- [ ] Set `NLLB_ENABLED=true`
- [ ] Configure other settings (MongoDB, ChromaDB, etc.)
- [ ] Save `.env` file

## 🧪 Verification Checklist

### 1. Python Environment
- [ ] Navigate to `backend/proxy`
- [ ] Activate virtual environment:
  - [ ] Windows: `venv\Scripts\activate`
  - [ ] Linux/Mac: `source venv/bin/activate`
- [ ] Verify prompt shows `(venv)`

### 2. Dependencies Check
- [ ] Run `python verify_setup.py`
- [ ] Verify all checks pass:
  - [ ] Python version ✓
  - [ ] Virtual environment ✓
  - [ ] Dependencies ✓
  - [ ] Model files ✓
  - [ ] Model loading ✓
  - [ ] Translation test ✓

### 3. Translation Test
- [ ] Run `python nllb_test.py`
- [ ] Verify translation output:
  - [ ] Original: "Hello, how are you?"
  - [ ] Translated: "Bonjour, comment allez-vous?"
- [ ] No errors in output

## 🚀 Backend Startup Checklist

### 1. Start External Services
- [ ] Start MongoDB (if using):
  - [ ] Run `mongod`
  - [ ] Verify connection on port 27017
- [ ] Start ChromaDB:
  - [ ] Run `chroma run --host localhost --port 8000`
  - [ ] Verify connection: `curl http://localhost:8000/api/v1/heartbeat`
- [ ] Start Ollama:
  - [ ] Run `ollama serve`
  - [ ] Pull models: `ollama pull deepseek-r1:1.5b`
  - [ ] Verify: `curl http://localhost:11434/api/tags`

### 2. Start Backend Server
- [ ] Navigate to `backend` directory
- [ ] Run `npm run dev`
- [ ] Verify startup messages:
  - [ ] "🚀 Starting NLLB-200 persistent server..."
  - [ ] "Loading NLLB-200 model from ..."
  - [ ] "✅ NLLB-200 model loaded and ready!"
  - [ ] "Server running on port 5001"

### 3. Health Check
- [ ] Test health endpoint:
  ```bash
  curl http://localhost:5001/api/query/health
  ```
- [ ] Verify response: `{"status": "ok"}`

## 🔌 API Testing Checklist

### 1. Translation API
- [ ] Test translation endpoint:
  ```bash
  curl -X POST http://localhost:5001/api/translate \
    -H "Content-Type: application/json" \
    -d '{
      "text": "Hello, how are you?",
      "srcLang": "eng_Latn",
      "tgtLang": "hin_Deva"
    }'
  ```
- [ ] Verify response contains translated text
- [ ] No errors in response

### 2. Upload API (Optional)
- [ ] Test file upload:
  ```bash
  curl -X POST http://localhost:5001/api/upload \
    -F "file=@test.pdf"
  ```
- [ ] Verify file uploaded successfully
- [ ] Check file appears in `uploads/files/`

### 3. Query API (Optional)
- [ ] Test query endpoint:
  ```bash
  curl -X POST http://localhost:5001/api/query \
    -H "Content-Type: application/json" \
    -d '{
      "query": "What is this document about?",
      "fileId": "your-file-id"
    }'
  ```
- [ ] Verify response contains answer

## 📊 Performance Checklist

### 1. Translation Speed
- [ ] Test single sentence translation
- [ ] Measure time (should be <1 second after first request)
- [ ] Test batch translation (multiple sentences)
- [ ] Verify batch is faster than individual

### 2. Resource Usage
- [ ] Check CPU usage (should be reasonable)
- [ ] Check RAM usage:
  - [ ] CPU mode: ~1.2GB for NLLB
  - [ ] GPU mode: ~2.4GB VRAM
- [ ] Check disk space (model + cache)

### 3. Cache Verification
- [ ] Translate same text twice
- [ ] Second translation should be instant (<10ms)
- [ ] Verify cache hit in logs

## 🐛 Troubleshooting Checklist

### If Setup Fails
- [ ] Check Python version (3.8+)
- [ ] Check internet connection
- [ ] Check disk space (~5GB free)
- [ ] Review error messages in terminal
- [ ] Check `proxy/error.log` for Python errors

### If Model Not Found
- [ ] Verify `proxy/models/nllb-200-distilled-600M/` exists
- [ ] Check required files:
  - [ ] `config.json`
  - [ ] `tokenizer.json`
  - [ ] `sentencepiece.bpe.model`
  - [ ] `pytorch_model.bin` or `model.safetensors`
- [ ] Re-run `python setup_models.py` if missing

### If Translation Fails
- [ ] Check NLLB server is running (backend logs)
- [ ] Verify Python process is active
- [ ] Check language codes are correct
- [ ] Review `proxy/error.log`
- [ ] Restart backend server

### If Performance is Slow
- [ ] Check if using CPU (expected to be slower)
- [ ] Verify INT8 quantization applied (CPU)
- [ ] Check batch size (increase for better throughput)
- [ ] Consider using GPU if available

## 📚 Documentation Checklist

### Files to Review
- [ ] `README.md` - Main backend documentation
- [ ] `NLLB_SETUP.md` - Detailed setup guide
- [ ] `QUICK_START.md` - Quick start guide
- [ ] `proxy/README.md` - Proxy services documentation
- [ ] `ARCHITECTURE.md` - System architecture
- [ ] `.env.example` - Environment variables

### Understanding
- [ ] Understand NLLB architecture
- [ ] Know how to start/stop services
- [ ] Know how to test translation
- [ ] Know where to find logs
- [ ] Know how to troubleshoot issues

## 🎯 Final Verification

### All Systems Go
- [ ] Backend server running
- [ ] NLLB server loaded
- [ ] Translation API working
- [ ] No errors in logs
- [ ] Performance acceptable
- [ ] Documentation reviewed

### Ready for Production
- [ ] All tests passing
- [ ] Error handling tested
- [ ] Performance benchmarked
- [ ] Logs configured
- [ ] Monitoring set up (optional)
- [ ] Backup strategy (optional)

## 📝 Notes

### Common Issues
1. **Virtual environment not activated**: Always activate before running Python scripts
2. **Port conflicts**: Change PORT in .env if 5001 is taken
3. **Model download fails**: Check internet and disk space
4. **Slow translation**: Expected on CPU, use GPU for speed

### Tips
1. **First translation is slow**: Model initialization takes time
2. **Cache helps**: Repeated translations are instant
3. **Batch processing**: Translate multiple sentences at once
4. **GPU preferred**: Much faster than CPU

### Support
- Check troubleshooting sections in documentation
- Review logs: `proxy/error.log` and backend console
- Run `verify_setup.py` to diagnose issues
- Open GitHub issue if stuck

---

## ✅ Setup Complete!

Once all items are checked, your NLLB-200 translation service is ready!

**Next Steps:**
1. Start using the translation API
2. Integrate with your frontend
3. Monitor performance and logs
4. Customize as needed

**Congratulations! 🎉**
