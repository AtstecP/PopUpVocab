export function loadWord(word, definition) {
  word.textContent = "Loading...";
  definition.textContent = "";

  fetch(chrome.runtime.getURL("/french/words.json"))
    .then((response) => response.json())
    .then((data) => {
      const keys = Object.keys(data);
      const randomKey = keys[Math.floor(Math.random() * keys.length)];
      const randomItem = data[randomKey];

      word.textContent = `${randomKey} (${randomItem.partOfSpeech})`;
      definition.textContent = randomItem.definition || "No definition found";
    })
    .catch((err) => {
      console.error("Error loading JSON:", err);
      word.textContent = "Error!";
      definition.textContent = "Failed to load word data.";
    });
}
