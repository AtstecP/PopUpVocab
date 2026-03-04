import { getWords } from "./storage.js";

import { makeDraggable } from "./draggable.js";
import { addSoundButton } from "./sound_button.js";

import { runDefinitionMode } from "./modes/definition_mode.js";
import { runTestMode } from "./modes/test_mode.js";
import { runTypingMode } from "./modes/typing_mode.js";

export function showWordPopup() {
  if (document.getElementById("word-popup")) return;

  const popup = document.createElement("div");
  popup.id = "word-popup";

  const word = document.createElement("span");
  word.textContent = "Loading...";

  const definition = document.createElement("p");
  definition.id = "word-definition";

  const nextBtn = document.createElement("button");
  nextBtn.className = "next-btn";
  nextBtn.textContent = "Next";
  nextBtn.onclick = () => {
    chrome.runtime.sendMessage({ action: "resetTimer" }, () => popup.remove());
  };

  popup.appendChild(word);
  popup.appendChild(definition);
  popup.appendChild(nextBtn);
  document.body.appendChild(popup);

  makeDraggable(popup);
  chrome.storage.local.get(
    ["definitionMode", "testMode", "typingMode", "vocabWords"],
    (data) => {
      const modes = [];

      if (data.definitionMode) modes.push(runDefinitionMode);
      if (data.testMode) modes.push(runTestMode);
      if (data.typingMode) modes.push(runTypingMode);

      // Use stored words if they exist, otherwise fallback to JSON
      const words =
        data.vocabWords && data.vocabWords.length > 0
          ? data.vocabWords
          : vocabData;

      if (modes.length > 0) {
        const randomMode = modes[Math.floor(Math.random() * modes.length)];
        randomMode(words, word, definition);
      } else {
        runDefinitionMode(words, word, definition);
      }

      addSoundButton(popup, word);
    },
  );
}
