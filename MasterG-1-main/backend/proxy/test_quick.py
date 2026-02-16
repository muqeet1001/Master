"""Quick test to verify NLLB server can load"""
import sys
from pathlib import Path

# Add current directory to path
sys.path.insert(0, str(Path(__file__).parent))

print("Testing NLLB model loading...")

try:
    from nllb_server import load_model
    
    print("Loading model...")
    tokenizer, model, device = load_model()
    
    print(f"✅ Model loaded successfully on {device}!")
    print(f"Tokenizer type: {type(tokenizer).__name__}")
    print(f"Model type: {type(model).__name__}")
    
    # Quick translation test
    print("\nTesting translation...")
    tokenizer.src_lang = "eng_Latn"
    inputs = tokenizer("Hello", return_tensors="pt")
    print("✅ Tokenization works!")
    
    print("\n🎉 NLLB is ready to use!")
    
except Exception as e:
    print(f"\n❌ Error: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
