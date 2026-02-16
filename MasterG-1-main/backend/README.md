# MasterG Backend

Backend server for MasterG - An AI-powered educational platform with multilingual support, RAG (Retrieval-Augmented Generation), and offline translation capabilities.

## 🚀 Features

- **Multilingual Support**: 200+ languages via NLLB-200 translation
- **RAG Pipeline**: Document processing with ChromaDB vector storage
- **Offline AI**: Local Ollama models (DeepSeek R1)
- **Document Processing**: PDF, DOCX, PPT, images with OCR
- **Chat System**: Stateful conversations with MongoDB
- **Speech-to-Text**: Whisper integration
- **Content Generation**: AI-powered educational content

## 📋 Prerequisites

- **Node.js**: 16 or higher
- **Python**: 3.8 or higher
- **MongoDB**: 5.0 or higher (optional)
- **ChromaDB**: Latest version
- **Ollama**: Latest version (for offline AI)

## 🔧 Installation

### 1. Install Node Dependencies

```bash
npm install
```

### 2. Set Up NLLB Translation (One-Time Setup)

**Option A: Automatic (Recommended)**

```bash
setup-nllb-once.bat
```

This will set up everything automatically (takes 10-15 minutes first time).

**Option B: Let npm handle it**

Just run `npm run dev` - it will check and install dependencies automatically!

**Note**: You may still need to download the model manually:
```bash
cd proxy
venv\Scripts\activate
python setup_models.py
```

### 3. Configure Environment

Create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Server
PORT=5001
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/masterg
CHROMA_URL=http://localhost:8000

# Ollama (Local AI)
OLLAMA_URL=http://localhost:11434
OLLAMA_CHAT_MODEL=deepseek-r1:1.5b
OLLAMA_EMBED_MODEL=embeddinggemma:latest

# NLLB Translation
NLLB_ENABLED=true
PYTHON_EXECUTABLE=python

# API Keys (optional - for cloud mode)
GROQ_API_KEY=your_groq_api_key
GEMMA_API_KEY=your_gemini_api_key
```

### 4. Start Services

**MongoDB** (if using):
```bash
mongod
```

**ChromaDB**:
```bash
chroma run --host localhost --port 8000
```

**Ollama**:
```bash
ollama serve
ollama pull deepseek-r1:1.5b
ollama pull embeddinggemma:latest
```

### 5. Start Backend

**Development**:
```bash
npm run dev
```

**Production**:
```bash
npm run build
npm start
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Express middleware
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   │   ├── nllb.service.ts        # NLLB translation
│   │   ├── ollama.service.ts      # Ollama AI
│   │   ├── embedding.service.ts   # Vector embeddings
│   │   └── ...
│   ├── types/           # TypeScript types
│   ├── utils/           # Utility functions
│   └── index.ts         # Entry point
├── proxy/               # Python proxy services
│   ├── nllb_server.py   # NLLB translation server
│   ├── setup_models.py  # Model download script
│   ├── requirements.txt # Python dependencies
│   └── models/          # Downloaded models
├── uploads/             # File storage
├── .env                 # Environment variables
├── package.json         # Node dependencies
└── tsconfig.json        # TypeScript config
```

## 🌐 API Endpoints

### Upload & Processing

- `POST /api/upload` - Upload documents (PDF, DOCX, PPT, images)
- `GET /api/upload/stats` - Get upload statistics
- `GET /api/files/:fileId` - Get file metadata
- `GET /api/files/:fileId/preview` - Preview file content

### Query & Chat

- `POST /api/query` - Query documents with RAG
- `GET /api/query/health` - Health check
- `POST /api/chats` - Create new chat
- `GET /api/chats/:chatId` - Get chat history
- `POST /api/chats/:chatId/messages` - Send message

### Translation

- `POST /api/translate` - Translate text (NLLB-200)
- `POST /api/translate/detect` - Detect language

### Content Generation

- `POST /api/stitch` - Generate educational content
- `POST /api/posters` - Generate posters
- `POST /api/lmr` - Learning material recommendations

### Speech

- `POST /api/speech/transcribe` - Speech-to-text (Whisper)

### Analysis

- `POST /api/analyze` - Analyze documents
- `GET /api/document-tree/:fileId` - Get document structure

## 🔌 NLLB Translation Service

### Setup

See [NLLB_SETUP.md](./NLLB_SETUP.md) for detailed setup instructions.

### Usage

```typescript
import { nllbService } from './services/nllb.service';

// Translate text
const translated = await nllbService.translate(
  "Hello, how are you?",
  {
    srcLang: "eng_Latn",
    tgtLang: "hin_Deva",
    batchSize: 8,
    useCache: true
  }
);
```

### Supported Languages

NLLB-200 supports 200+ languages including:
- English (`eng_Latn`)
- Hindi (`hin_Deva`)
- Spanish (`spa_Latn`)
- French (`fra_Latn`)
- Chinese (`zho_Hans`)
- Arabic (`arb_Arab`)
- And 194+ more...

See [proxy/README.md](./proxy/README.md) for complete language list.

## 🧪 Testing

### Test NLLB Setup

```bash
cd proxy
source venv/bin/activate  # or venv\Scripts\activate on Windows
python verify_setup.py
```

### Test Translation

```bash
cd proxy
source venv/bin/activate
python nllb_test.py
```

### Test Backend API

```bash
# Health check
curl http://localhost:5001/api/query/health

# Upload document
curl -X POST http://localhost:5001/api/upload \
  -F "file=@document.pdf"

# Translate text
curl -X POST http://localhost:5001/api/translate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello",
    "srcLang": "eng_Latn",
    "tgtLang": "hin_Deva"
  }'
```

## 🐛 Troubleshooting

### NLLB Issues

See [NLLB_SETUP.md](./NLLB_SETUP.md#-troubleshooting) for NLLB-specific issues.

### MongoDB Connection Failed

```bash
# Check if MongoDB is running
mongod --version

# Start MongoDB
mongod
```

### ChromaDB Connection Failed

```bash
# Check if ChromaDB is running
curl http://localhost:8000/api/v1/heartbeat

# Start ChromaDB
chroma run --host localhost --port 8000
```

### Ollama Not Available

```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# Start Ollama
ollama serve

# Pull required models
ollama pull deepseek-r1:1.5b
ollama pull embeddinggemma:latest
```

### Port Already in Use

```bash
# Change PORT in .env
PORT=5002
```

## 📊 Performance

### NLLB Translation Speed

| Hardware | Speed | Notes |
|----------|-------|-------|
| CPU (8 cores) | ~2-5 sentences/sec | With INT8 quantization |
| GPU (CUDA) | ~10-20 sentences/sec | With batch processing |
| GPU (Apple Silicon) | ~8-15 sentences/sec | MPS acceleration |

### Memory Usage

| Component | RAM | Notes |
|-----------|-----|-------|
| Node.js Backend | ~200MB | Base memory |
| NLLB Model (CPU) | ~1.2GB | With INT8 quantization |
| NLLB Model (GPU) | ~2.4GB | FP32 weights |
| Ollama Models | ~2-4GB | Depends on model size |
| ChromaDB | ~100MB | Base memory |

## 🔒 Security

- **Offline Operation**: All AI processing happens locally
- **No Data Leakage**: Your data never leaves your machine
- **Privacy-First**: No telemetry or tracking
- **Secure Storage**: Files stored locally with access control

## 📚 Documentation

- [NLLB Setup Guide](./NLLB_SETUP.md) - Detailed NLLB-200 setup
- [Proxy README](./proxy/README.md) - Python proxy services
- [API Documentation](./docs/API.md) - API reference (if available)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

[Your License Here]

## 🆘 Support

For issues and questions:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Review [NLLB_SETUP.md](./NLLB_SETUP.md) for translation issues
3. Check logs in `proxy/error.log` for Python errors
4. Open an issue on GitHub

## 🎯 Roadmap

- [ ] Add more translation models
- [ ] Improve RAG performance
- [ ] Add more document formats
- [ ] Enhance content generation
- [ ] Add real-time collaboration
- [ ] Mobile app integration

## 🙏 Acknowledgments

- **Meta AI** - NLLB-200 translation model
- **Ollama** - Local AI inference
- **ChromaDB** - Vector database
- **DeepSeek** - R1 reasoning model
- **Hugging Face** - Model hosting and transformers library
