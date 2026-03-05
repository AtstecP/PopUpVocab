import "./action.css";

document.addEventListener("DOMContentLoaded", () => {
  // Manual Entry Elements
  const wordInput = document.getElementById("word");
  const definitionInput = document.getElementById("definition");
  const posInput = document.getElementById("pos");
  const addBtn = document.getElementById("add-word-btn");
  
  // JSON Import Elements
  const jsonFileInput = document.getElementById("json-file");
  const loadJsonBtn = document.getElementById("load-json-btn");
  
  // Status Display
  const status = document.getElementById("add-status");

  // Helper function to show messages
  function showMessage(msg, isError = false) {
    status.textContent = msg;
    status.style.color = isError ? "red" : "green";
    setTimeout(() => { status.textContent = ""; }, 3000);
  }

  // ==========================================
  // 1. MANUAL ENTRY LOGIC
  // ==========================================
  addBtn.addEventListener("click", () => {
    const word = wordInput.value.trim();
    const definition = definitionInput.value.trim();
    const partOfSpeech = posInput.value.trim();

    if (!word || !definition) {
      showMessage("Word and Definition are required!", true);
      return;
    }

    chrome.storage.local.get(["vocabWords"], (data) => {
      const currentWords = data.vocabWords || [];

      const newWordEntry = {
        [word]: {
          "definition": definition,
          "partOfSpeech": partOfSpeech
        }
      };

      currentWords.push(newWordEntry);

      chrome.storage.local.set({ vocabWords: currentWords }, () => {
        showMessage(`"${word}" added successfully!`);
        wordInput.value = "";
        definitionInput.value = "";
        posInput.value = "";
      });
    });
  });

  // ==========================================
  // 2. BULK IMPORT LOGIC (JSON)
  // ==========================================
  loadJsonBtn.addEventListener("click", () => {
    const file = jsonFileInput.files[0];
    
    if (!file) {
      showMessage("Please select a JSON file first.", true);
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const parsedData = JSON.parse(event.target.result);
        let newWordsFormatted = [];

        // Check how the JSON is formatted and adapt it to your array structure
        if (Array.isArray(parsedData)) {
          // If they uploaded an array, assume it's already formatted correctly
          newWordsFormatted = parsedData;
        } else if (typeof parsedData === "object" && parsedData !== null) {
          // If they uploaded a standard dictionary { "word": {...}, "word2": {...} }
          // Convert it into your array format: [{"word": {...}}, {"word2": {...}}]
          for (const [key, value] of Object.entries(parsedData)) {
            newWordsFormatted.push({ [key]: value });
          }
        } else {
          throw new Error("Invalid format. Must be an object or array.");
        }

        // Fetch existing words and merge
        chrome.storage.local.get(["vocabWords"], (data) => {
          const currentWords = data.vocabWords || [];
          const updatedWords = currentWords.concat(newWordsFormatted);

          // Save the merged list back to storage
          chrome.storage.local.set({ vocabWords: updatedWords }, () => {
            showMessage(`Successfully imported ${newWordsFormatted.length} words!`);
            jsonFileInput.value = ""; // Clear the file input
          });
        });

      } catch (error) {
        console.error("JSON Parse Error:", error);
        showMessage("Error: Invalid JSON file.", true);
      }
    };

    // This triggers the onload event above
    reader.readAsText(file); 
  });
});