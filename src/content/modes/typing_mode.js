export function runTypingMode(vocabData, wordElement, definitionElement) {
  const words = Object.keys(vocabData || {});
  if (!words.length) return;

  // ---- pick a word ----
  const correctWord = getRandom(words);
  const { definition: correctDef = "", partOfSpeech = "" } = vocabData[correctWord] || {};

  // ---- render prompt ----
  wordElement.textContent = correctWord;
  definitionElement.innerHTML = ""; // reset

  // UI: input + feedback + correct answer block
  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Type and press Enter…";
  input.autocomplete = "off";
  input.className = "typing-input";

  const feedback = document.createElement("div");
  feedback.className = "typing-feedback";

  const correctBlock = document.createElement("div");
  correctBlock.className = "typing-correct";

  definitionElement.appendChild(input);
  definitionElement.appendChild(feedback);
  definitionElement.appendChild(correctBlock);

  // ---- helpers ----
  function normalize(s) {
    return String(s || "")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ")
      .replace(/[^\p{L}\p{N}\s]/gu, ""); // strip punctuation, keep letters/numbers
  }
  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }
  function showCorrect() {
    const defSafe = escapeHtml(correctDef || "");
    const posSafe = escapeHtml(partOfSpeech || "");
    correctBlock.innerHTML = posSafe ? `${defSafe}<br>(${posSafe})` : defSafe;
  }

  let graded = false;

  input.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;

    // first Enter → grade
    if (!graded) {
      const user = normalize(input.value);
      const expected = normalize(correctDef);

      if (user && expected && user === expected) {
        new Audio(chrome.runtime.getURL("sounds/correct.mp3")).play();
        feedback.textContent = "✅ Correct!";
        feedback.style.color = "green";
      } else {
        new Audio(chrome.runtime.getURL("sounds/wrong.mp3")).play();
        feedback.textContent = "❌ Not quite.";
        feedback.style.color = "crimson";
      }
      showCorrect();
      graded = true;
      
    
    }
  });

  // focus for convenience
  setTimeout(() => input.focus(), 0);
}

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
