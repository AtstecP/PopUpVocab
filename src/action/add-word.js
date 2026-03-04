import "./action.css";

document.addEventListener("DOMContentLoaded", () => {
  const wordInput = document.getElementById("word");
  const definitionInput = document.getElementById("definition");
  const posInput = document.getElementById("pos");
  const addBtn = document.getElementById("add-word-btn");
  const status = document.getElementById("add-status");

  addBtn.addEventListener("click", () => {
    const word = wordInput.value.trim();
    const definition = definitionInput.value.trim();
    const partOfSpeech = posInput.value.trim();

    // Basic validation
    if (!word || !definition) {
      status.textContent = "Word and Definition are required!";
      status.style.color = "red";
      return;
    }

    // Fetch existing words array from local storage
    chrome.storage.local.get(["vocabWords"], (data) => {
      const currentWords = data.vocabWords || [];

      // Format the new word exactly as requested
      const newWordEntry = {
        [word]: {
          "definition": definition,
          "partOfSpeech": partOfSpeech
        }
      };

      // Push the new word to the array
      currentWords.push(newWordEntry);

      // Save the updated array back to storage
      chrome.storage.local.set({ vocabWords: currentWords }, () => {
        status.textContent = `"${word}" added successfully!`;
        status.style.color = "green";

        // Clear the inputs for the next word
        wordInput.value = "";
        definitionInput.value = "";
        posInput.value = "";
        
        // Clear success message after 2 seconds
        setTimeout(() => {
          status.textContent = "";
        }, 2000);
      });
    });
  });
});