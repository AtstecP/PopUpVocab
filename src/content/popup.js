import { makeDraggable } from "./draggable.js";
import { loadWord } from "./word_load_chunks.js";

export function showWordPopup() {
  if (document.getElementById("word-popup")) return;

  const popup = document.createElement("div");
  popup.id = "word-popup";

  const word = document.createElement("span");
  word.textContent = "Loading...";

  const definition = document.createElement("p");
  definition.id = "word-definition";

  const nextBtn = document.createElement("button");
  nextBtn.textContent = "Next";
  nextBtn.onclick = () => {
    chrome.runtime.sendMessage({ action: "resetTimer" }, () => popup.remove());
  };

  popup.appendChild(word);
  popup.appendChild(definition);
  popup.appendChild(nextBtn);
  document.body.appendChild(popup);

  makeDraggable(popup);
  loadWord(word, definition);
}
