import json
import requests
import time
import os

INPUT_FILE = "words_with_definitions.json"
OUTPUT_FOLDER = "output_chunks"
API_URL = "https://api.dictionaryapi.dev/api/v2/entries/en/{}"
CHUNK_SIZE = 100

# Создаём папку, если её нет
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# Загрузка исходных слов
with open(INPUT_FILE, "r", encoding="utf-8") as f:
    words_raw = json.load(f)

# Только слова без определений и без A/B/C разделителей
words_to_fetch = [word for word in words_raw if not words_raw[word] and word.isalpha()]
total = len(words_to_fetch)

# Результат будем сохранять сюда
filled = {}
processed = 0
chunk_index = 1

for word in words_to_fetch:
    try:
        resp = requests.get(API_URL.format(word), timeout=10)
        if resp.status_code == 200:
            data = resp.json()
            meanings = data[0].get("meanings", [])
            if meanings:
                pos = meanings[0].get("partOfSpeech", "")
                defs = meanings[0].get("definitions", [])
                if defs:
                    filled[word] = {
                        "partOfSpeech": pos,
                        "definition": defs[0].get("definition", "")
                    }
                else:
                    filled[word] = {"partOfSpeech": "", "definition": ""}
            else:
                filled[word] = {"partOfSpeech": "", "definition": ""}
        else:
            filled[word] = {"partOfSpeech": "", "definition": ""}
    except Exception as e:
        print(f"⚠️ Error fetching '{word}': {e}")
        filled[word] = {"partOfSpeech": "", "definition": ""}

    processed += 1
    print(f"[{processed}/{total}] {word} ✓")

    # Пауза, чтобы не забанили
    time.sleep(1)

    # Сохраняем каждые 100 слов в отдельный файл
    if processed % CHUNK_SIZE == 0 or processed == total:
        chunk_path = os.path.join(OUTPUT_FOLDER, f"chunk_{chunk_index:03}.json")
        with open(chunk_path, "w", encoding="utf-8") as chunk_file:
            json.dump(filled, chunk_file, indent=2, ensure_ascii=False)
        print(f"📁 Saved: {chunk_path}")
        chunk_index += 1
        filled = {}  # обнуляем для следующего куска

print("\n All done.")
