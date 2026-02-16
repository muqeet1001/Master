"""
Quick diagnostic script to check NLLB setup status
"""

import sys
import os
from pathlib import Path

def check_module(module_name, display_name=None):
    """Check if a Python module is installed"""
    if display_name is None:
        display_name = module_name
    
    try:
        mod = __import__(module_name)
        version = getattr(mod, '__version__', 'unknown')
        print(f"✓ {display_name}: {version}")
        return True
    except ImportError:
        print(f"✗ {display_name}: NOT INSTALLED")
        return False

def main():
    print("\n" + "=" * 60)
    print("NLLB-200 Setup Diagnostic")
    print("=" * 60 + "\n")
    
    # Check Python version
    print(f"Python: {sys.version}")
    print(f"Python executable: {sys.executable}")
    print()
    
    # Check if in virtual environment
    in_venv = hasattr(sys, 'real_prefix') or (
        hasattr(sys, 'base_prefix') and sys.base_prefix != sys.prefix
    )
    
    if in_venv:
        print(f"✓ Virtual environment: {sys.prefix}")
    else:
        print("✗ NOT in virtual environment")
        print("  Run: venv\\Scripts\\activate (Windows)")
        print("  Or:  source venv/bin/activate (Linux/Mac)")
    print()
    
    # Check required modules
    print("Checking dependencies:")
    print("-" * 60)
    
    modules = {
        'torch': 'PyTorch',
        'transformers': 'Transformers',
        'huggingface_hub': 'Hugging Face Hub',
        'numpy': 'NumPy',
        'protobuf': 'Protobuf',
        'accelerate': 'Accelerate',
    }
    
    all_installed = True
    for module, name in modules.items():
        if not check_module(module, name):
            all_installed = False
    
    print()
    
    # Check model files
    print("Checking model files:")
    print("-" * 60)
    
    BASE_DIR = Path(__file__).resolve().parent
    MODELS_DIR = BASE_DIR / "models"
    NLLB_MODEL_PATH = MODELS_DIR / "nllb-200-distilled-600M"
    
    if NLLB_MODEL_PATH.exists():
        print(f"✓ Model directory: {NLLB_MODEL_PATH}")
        
        required_files = [
            "config.json",
            "tokenizer.json",
            "sentencepiece.bpe.model",
        ]
        
        for fname in required_files:
            if (NLLB_MODEL_PATH / fname).exists():
                print(f"  ✓ {fname}")
            else:
                print(f"  ✗ {fname} MISSING")
        
        # Check for weight files
        if (NLLB_MODEL_PATH / "pytorch_model.bin").exists():
            print(f"  ✓ pytorch_model.bin")
        elif (NLLB_MODEL_PATH / "model.safetensors").exists():
            print(f"  ✓ model.safetensors")
        else:
            print(f"  ✗ No weight files found")
    else:
        print(f"✗ Model directory not found: {NLLB_MODEL_PATH}")
        print("  Run: python setup_models.py")
    
    print()
    print("=" * 60)
    
    if not all_installed:
        print("\n❌ ISSUE: Some dependencies are missing")
        print("\nTo fix:")
        print("  1. Activate virtual environment:")
        print("     venv\\Scripts\\activate (Windows)")
        print("     source venv/bin/activate (Linux/Mac)")
        print("  2. Install dependencies:")
        print("     pip install -r requirements.txt")
        print("  3. Run this script again to verify")
        return 1
    
    if not NLLB_MODEL_PATH.exists():
        print("\n⚠️  WARNING: Model not downloaded")
        print("\nTo fix:")
        print("  python setup_models.py")
        return 1
    
    print("\n✅ Setup looks good!")
    print("\nNext steps:")
    print("  1. Start backend: cd .. && npm run dev")
    print("  2. Test translation: python nllb_test.py")
    return 0

if __name__ == "__main__":
    sys.exit(main())
