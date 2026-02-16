import sys
import os

print(f"Python executable: {sys.executable}")
print(f"Python version: {sys.version}")
print(f"CWD: {os.getcwd()}")

try:
    print("Attempting to import torch...")
    import torch
    print(f"torch ok, version: {torch.__version__}")
    
    print("Attempting to import transformers...")
    import transformers
    print(f"transformers ok, version: {transformers.__version__}")
    
    print("Attempting to import AutoModelForSeq2SeqLM...")
    from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
    print("AutoModelForSeq2SeqLM ok")
    
    print("Checking CUDA/MPS...")
    print(f"CUDA available: {torch.cuda.is_available()}")
    if hasattr(torch.backends, "mps"):
        print(f"MPS available: {torch.backends.mps.is_available()}")
    
except Exception as e:
    print(f"\n❌ ERROR during diagnostic: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

print("\nAll library imports successful!")
