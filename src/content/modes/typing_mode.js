export function runTypingMode(popup, wordElement, definitionElement) {
  // wordElement.textContent = "Loading...";

  // import("../word_load_chunks.js").then(({ loadWord }) => {
  //   loadWord(wordElement, definitionElement).then(() => {
  //     const input = document.createElement("input");
  //     input.placeholder = "Type the word here...";
  //     input.className = "typing-input";

  //     const checkBtn = document.createElement("button");
  //     checkBtn.textContent = "Check";

  //     checkBtn.onclick = () => {
  //       if (input.value.trim().toLowerCase() === wordElement.textContent.toLowerCase()) {
  //         checkBtn.textContent = "Correct!";
  //         checkBtn.style.background = "#4CAF50";
  //       } else {
  //         checkBtn.textContent = "Try Again";
  //         checkBtn.style.background = "#E53935";
  //       }
  //     };

  //     popup.appendChild(input);
  //     popup.appendChild(checkBtn);
  //   });
  // });
}
