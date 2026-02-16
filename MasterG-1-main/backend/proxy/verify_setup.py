"""
NLLB-200 Setup Verification Script

This script checks if NLLB-200 is properly set up and ready to use.
Run this after setup to verify everything is working correctly.

Usage:
  python verify_setup.py
"""

import sys
import os
from pathlib import Path

# Color codes for terminal output
GREEN = '\033[92m'
RED = '\033[91m'
YELLOW = '\033[93m'
BLUE = '\033[94m'
RESET = '\033[0m'

def print_header(text):
    print(f"\n{BLUE}{'=' * 70}{RESET}")
    print(f"{BLUE}{text.center(70)}{RESET}")
    print(f"{BLUE}{'=' * 70}{RESET}\n")

def print_success(text):
    print(f"{GREEN}✓ {text}{RESET}")

def print_error(text):
    print(f"{RED}✗ {text}{RESET}")

def print_warning(text):
    print(f"{YELLOW}⚠ {text}{RESET}")

def print_info(text):
    print(f"  {text}")

def check_python_version():
    """Check if Python version is 3.8+"""
    print("Checking Python version...")
    version = sys.version_info
    if version.major >= 3 and version.minor >= 8:
        print_success(f"Python {version.major}.{version.minor}.{version.micro}")
        return True
    else:
        print_error(f"Python {version.major}.{version.minor}.{version.micro} (requires 3.8+)")
        return False

def check_virtual_environment():
    """Check if running in virtual environment"""
    print("\nChecking virtual environment...")
    in_venv = hasattr(sys, 'real_prefix') or (
        hasattr(sys, 'base_prefix') and sys.base_prefix != sys.prefix
    )
    
    if in_venv:
        print_success(f"Virtual environment active: {sys.prefix}")
        return True
    else:
        print_warning("Not running in virtual environment")
        print_info("Recommended: Activate venv before running")
        return False

def check_dependencies():
    """Check if required packages are installed"""
    print("\nChecking dependencies...")
    
    required_packages = {
        'torch': 'PyTorch',
        'transformers': 'Transformers',
        'huggingface_hub': 'Hugging Face Hub',
    }
    
    all_installed = True
    for package, name in required_packages.items():
        try:
            __import__(package)
            print_success(f"{name} installed")
        except ImportError:
            print_error(f"{name} not installed")
            all_installed = False
    
    return all_installed

def check_model_files():
    """Check if NLLB model files exist"""
    print("\nChecking NLLB model files...")
    
    BASE_DIR = Path(__file__).resolve().parent
    MODELS_DIR = Path(os.environ.get("NLLB_MODELS_DIR", BASE_DIR / "models")).expanduser().resolve()
    NLLB_MODEL_PATH = Path(
        os.environ.get("NLLB_MODEL_PATH", MODELS_DIR / "nllb-200-distilled-600M")
    ).expanduser().resolve()
    
    if not NLLB_MODEL_PATH.exists():
        print_error(f"Model directory not found: {NLLB_MODEL_PATH}")
        print_info("Run: python setup_models.py")
        return False
    
    print_success(f"Model directory exists: {NLLB_MODEL_PATH}")
    
    required_files = [
        "config.json",
        "tokenizer.json",
        "sentencepiece.bpe.model",
    ]
    
    weight_files = ["pytorch_model.bin", "model.safetensors"]
    
    all_files_exist = True
    for fname in required_files:
        if (NLLB_MODEL_PATH / fname).exists():
            print_success(f"  {fname}")
        else:
            print_error(f"  {fname} missing")
            all_files_exist = False
    
    # Check for at least one weight file
    has_weights = any((NLLB_MODEL_PATH / fname).exists() for fname in weight_files)
    if has_weights:
        for fname in weight_files:
            if (NLLB_MODEL_PATH / fname).exists():
                print_success(f"  {fname}")
                break
    else:
        print_error(f"  No weight files found (need {' or '.join(weight_files)})")
        all_files_exist = False
    
    return all_files_exist

def check_model_loading():
    """Try to load the model"""
    print("\nTesting model loading...")
    
    try:
        import torch
        from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
        
        BASE_DIR = Path(__file__).resolve().parent
        MODELS_DIR = Path(os.environ.get("NLLB_MODELS_DIR", BASE_DIR / "models")).expanduser().resolve()
        NLLB_MODEL_PATH = Path(
            os.environ.get("NLLB_MODEL_PATH", MODELS_DIR / "nllb-200-distilled-600M")
        ).expanduser().resolve()
        
        print_info("Loading tokenizer...")
        tokenizer = AutoTokenizer.from_pretrained(
            NLLB_MODEL_PATH,
            trust_remote_code=True,
            local_files_only=True,
        )
        print_success("Tokenizer loaded")
        
        print_info("Loading model (this may take a moment)...")
        model = AutoModelForSeq2SeqLM.from_pretrained(
            NLLB_MODEL_PATH,
            trust_remote_code=True,
            local_files_only=True,
            low_cpu_mem_usage=True,
        )
        print_success("Model loaded")
        
        # Check device
        if torch.cuda.is_available():
            device = "cuda"
            print_success(f"GPU available: CUDA")
        elif hasattr(torch.backends, "mps") and torch.backends.mps.is_available():
            device = "mps"
            print_success(f"GPU available: Apple Silicon (MPS)")
        else:
            device = "cpu"
            print_warning(f"Using CPU (GPU not available)")
        
        return True
        
    except Exception as e:
        print_error(f"Failed to load model: {e}")
        return False

def check_translation():
    """Test a simple translation"""
    print("\nTesting translation...")
    
    try:
        import torch
        from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
        
        BASE_DIR = Path(__file__).resolve().parent
        MODELS_DIR = Path(os.environ.get("NLLB_MODELS_DIR", BASE_DIR / "models")).expanduser().resolve()
        NLLB_MODEL_PATH = Path(
            os.environ.get("NLLB_MODEL_PATH", MODELS_DIR / "nllb-200-distilled-600M")
        ).expanduser().resolve()
        
        tokenizer = AutoTokenizer.from_pretrained(
            NLLB_MODEL_PATH,
            trust_remote_code=True,
            local_files_only=True,
        )
        
        model = AutoModelForSeq2SeqLM.from_pretrained(
            NLLB_MODEL_PATH,
            trust_remote_code=True,
            local_files_only=True,
            low_cpu_mem_usage=True,
        )
        
        # Detect device
        if torch.cuda.is_available():
            device = "cuda"
        elif hasattr(torch.backends, "mps") and torch.backends.mps.is_available():
            device = "mps"
        else:
            device = "cpu"
        
        model = model.to(device)
        model.eval()
        
        # Test translation: English to Hindi
        text = "Hello, how are you?"
        src_lang = "eng_Latn"
        tgt_lang = "hin_Deva"
        
        print_info(f"Translating: '{text}'")
        print_info(f"From: {src_lang} → To: {tgt_lang}")
        
        tokenizer.src_lang = src_lang
        inputs = tokenizer(text, return_tensors="pt", max_length=512, truncation=True)
        inputs = {k: v.to(device) for k, v in inputs.items()}
        
        vocab = tokenizer.get_vocab()
        tgt_lang_id = vocab.get(tgt_lang, vocab.get("eng_Latn", 256068))
        
        with torch.inference_mode():
            outputs = model.generate(
                **inputs,
                forced_bos_token_id=tgt_lang_id,
                max_length=512,
                num_beams=2,
                use_cache=True,
                early_stopping=True,
            )
        
        translation = tokenizer.batch_decode(outputs, skip_special_tokens=True)[0]
        
        print_success(f"Translation: '{translation}'")
        return True
        
    except Exception as e:
        print_error(f"Translation test failed: {e}")
        return False

def main():
    """Run all verification checks"""
    print_header("NLLB-200 Setup Verification")
    
    checks = [
        ("Python Version", check_python_version),
        ("Virtual Environment", check_virtual_environment),
        ("Dependencies", check_dependencies),
        ("Model Files", check_model_files),
        ("Model Loading", check_model_loading),
        ("Translation Test", check_translation),
    ]
    
    results = []
    for name, check_func in checks:
        try:
            result = check_func()
            results.append((name, result))
        except Exception as e:
            print_error(f"Check failed with exception: {e}")
            results.append((name, False))
    
    # Summary
    print_header("Verification Summary")
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for name, result in results:
        if result:
            print_success(f"{name}")
        else:
            print_error(f"{name}")
    
    print(f"\n{BLUE}Results: {passed}/{total} checks passed{RESET}\n")
    
    if passed == total:
        print_success("✓ NLLB-200 is fully set up and ready to use!")
        print_info("You can now start the backend server with: npm run dev")
        return 0
    else:
        print_error("✗ Some checks failed. Please review the errors above.")
        print_info("Run setup_models.py to download the model if needed.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
