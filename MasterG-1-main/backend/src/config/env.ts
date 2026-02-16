import dotenv from "dotenv";
import path from "path";

// Load environment variables (minimal - most values are hardcoded)
dotenv.config();

interface EnvConfig {
  // Server
  PORT: number;
  NODE_ENV: string;

  // ChromaDB
  CHROMA_URL: string;
  CHROMA_COLLECTION_NAME: string;

  // MongoDB
  MONGODB_URI: string;

  // File Storage
  UPLOAD_DIR: string;
  MAX_FILE_SIZE: number;

  // Chunking
  CHUNK_SIZE: number;
  CHUNK_OVERLAP: number;

  // Query Optimization
  ENABLE_QUERY_OPTIMIZATION: boolean;

  // Ollama Configuration (local AI)
  OLLAMA_URL: string;
  OLLAMA_CHAT_MODEL: string;
  OLLAMA_EMBED_MODEL: string;

  // Legacy external APIs (kept for type compatibility; not used in fully-local mode)
  OLLAMA_MODEL: string;
  GEMMA_API_KEY: string;

  // Groq API (for cloud mode - optional)
  GROQ_API_KEY: string;

  // NLLB-200 Configuration (translation service)
  NLLB_ENABLED: boolean;

  // Python Executable (for proxy services)
  PYTHON_EXECUTABLE: string;
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CONFIGURATION - Reads from .env file with sensible defaults
 * All values can be overridden via environment variables
 * ═══════════════════════════════════════════════════════════════════════════
 */
export const env: EnvConfig = {
  // Server
  PORT: parseInt(process.env.PORT || "5001", 10),
  NODE_ENV: process.env.NODE_ENV || "development",

  // ChromaDB - Local vector database
  CHROMA_URL: process.env.CHROMA_URL || "http://localhost:8000",
  CHROMA_COLLECTION_NAME: process.env.CHROMA_COLLECTION_NAME || "edu_notes",

  // MongoDB - Local database
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/masterg",

  // File Storage
  UPLOAD_DIR: process.env.UPLOAD_DIR || "./uploads",
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || "31457280", 10), // 30MB

  // Chunking Configuration
  CHUNK_SIZE: parseInt(process.env.CHUNK_SIZE || "1000", 10),
  CHUNK_OVERLAP: parseInt(process.env.CHUNK_OVERLAP || "200", 10),

  // Query Optimization
  ENABLE_QUERY_OPTIMIZATION: process.env.ENABLE_QUERY_OPTIMIZATION !== "false",

  // Ollama Configuration (local AI - DeepSeek R1)
  OLLAMA_URL: process.env.OLLAMA_URL || "http://localhost:11434",
  OLLAMA_CHAT_MODEL: process.env.OLLAMA_CHAT_MODEL || "deepseek-r1:1.5b",
  OLLAMA_EMBED_MODEL: process.env.OLLAMA_EMBED_MODEL || "embeddinggemma:latest",

  // Legacy external APIs
  OLLAMA_MODEL: process.env.OLLAMA_MODEL || "deepseek-r1:1.5b",
  GEMMA_API_KEY: process.env.GEMMA_API_KEY || "",

  // Groq API (for cloud mode - optional)
  GROQ_API_KEY: process.env.GROQ_API_KEY || "",

  // NLLB-200 Configuration (translation)
  NLLB_ENABLED: process.env.NLLB_ENABLED !== "false",

  // Python Executable
  PYTHON_EXECUTABLE: process.env.PYTHON_EXECUTABLE || "python",
};

export default env;
