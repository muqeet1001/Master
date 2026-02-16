import torch
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline

# 1. Select the model size (600M is recommended for local machines)
model_name = "facebook/nllb-200-distilled-600M"

# 2. Load the tokenizer and model
print("Loading model...")
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSeq2SeqLM.from_pretrained(model_name)

# 3. Move model to GPU if available
device = 0 if torch.cuda.is_available() else -1
print(f"Running on: {'GPU' if device == 0 else 'CPU'}")

# 4. Initialize the translation pipeline
# Define source and target languages (using NLLB codes)
# Example: English (eng_Latn) to French (fra_Latn)
translator = pipeline("translation", model=model, tokenizer=tokenizer, src_lang="eng_Latn", tgt_lang="fra_Latn", device=device)

# 5. Run translation
text = "Hello, how are you?"
result = translator(text, max_length=400)

print(f"Original: {text}")
print(f"Translated: {result[0]['translation_text']}")
