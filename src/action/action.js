import "./action.css";

document.addEventListener("DOMContentLoaded", () => {
  const intervalInput = document.getElementById("interval");
  const saveBtn = document.getElementById("save");
  const status = document.getElementById("status");
  const nextBtn = document.getElementById("next");

  chrome.storage.local.get(["wordInterval"], (data) => {
    if (data.wordInterval) {
      intervalInput.value = data.wordInterval;
    }
  });

  saveBtn.addEventListener("click", () => {
    const interval = parseFloat(intervalInput.value); // Changed from parseInt to parseFloat

    if (isNaN(interval) || interval < 0.01) {
      // Changed minimum check to 0.01
      status.textContent = "Please enter a valid number (minimum 0.01)!";
      status.style.color = "red";
      return;
    }

    chrome.storage.local.set({ wordInterval: interval }, () => {
      status.textContent = "Interval saved!";
      status.style.color = "green";

      chrome.alarms.clear("vocabTimer", () => {
        chrome.alarms.create("vocabTimer", {
          delayInMinutes: interval,
          periodInMinutes: interval,
        });

        setTimeout(() => window.close(), 1000);
      });
    });
  });
});
