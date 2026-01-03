import json
import requests
from concurrent.futures import ThreadPoolExecutor, as_completed

INPUT_FILE = "words_with_definitions.json"
OUTPUT_FILE = "words_with_pos_and_definitions.json"
API_URL = "https://api.dictionaryapi.dev/api/v2/entries/en/{}"
MAX_WORKERS = 10

with open(INPUT_FILE, "r", encoding="utf-8") as f:
    word_dict = json.load(f)

words_to_fetch = [word for word in word_dict if word.isalpha() and not word_dict[word]]

def fetch_definition(word):
    try:
        resp = requests.get(API_URL.format(word), timeout=10)
        if resp.status_code == 200:
            data = resp.json()
            meanings = data[0].get("meanings", [])
            if meanings:
                pos = meanings[0].get("partOfSpeech", "")
                definitions = meanings[0].get("definitions", [])
                if definitions:
                    definition = definitions[0].get("definition", "")
                    return word, {"partOfSpeech": pos, "definition": definition}
    except Exception as e:
        print(f"⚠️ Error fetching '{word}': {e}")
    return word, {"partOfSpeech": "", "definition": ""}

with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
    futures = {executor.submit(fetch_definition, word): word for word in words_to_fetch}
    for i, future in enumerate(as_completed(futures), 1):
        word, result = future.result()
        word_dict[word] = result
        print(f"[{i}/{len(words_to_fetch)}] {word} ✓")

with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(word_dict, f, indent=2, ensure_ascii=False)

print(f"\nDone. Saved to {OUTPUT_FILE}")
