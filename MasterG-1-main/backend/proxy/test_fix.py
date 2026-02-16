"""
Quick test to verify NLLB tokenizer fix.
This directly tests the translation function from nllb_server.py
"""

import sys
import os
from pathlib import Path

# Add proxy directory to path
proxy_dir = Path(__file__).resolve().parent
sys.path.insert(0, str(proxy_dir))

# Force offline mode
os.environ["TRANSFORMERS_OFFLINE"] = "1"
os.environ["HF_DATASETS_OFFLINE"] = "1"
os.environ["HF_HUB_OFFLINE"] = "1"

# Import the translate function
from nllb_server import translate

# Test translation
print("Testing NLLB translation...")
print("=" * 60)

test_text = "Hello, how are you?"
src_lang = "eng_Latn"  # English
tgt_lang = "hin_Deva"  # Hindi

print(f"Source text: {test_text}")
print(f"Source language: {src_lang}")
print(f"Target language: {tgt_lang}")
print("=" * 60)

try:
    result = translate(test_text, src_lang, tgt_lang)
    
    if result["success"]:
        print("✅ Translation successful!")
        print(f"Translated text: {result['translated']}")
    else:
        print("❌ Translation failed!")
        print(f"Error: {result.get('error', 'Unknown error')}")
except Exception as e:
    print(f"❌ Exception occurred: {e}")
    import traceback
    traceback.print_exc()
