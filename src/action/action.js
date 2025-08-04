import "./action.css";

document.addEventListener("DOMContentLoaded", () => {
  const intervalInput = document.getElementById("interval");
  const saveBtn = document.getElementById("save");
  const status = document.getElementById("status");

  const definitionMode = document.getElementById("definition-mode");
  const testMode = document.getElementById("test-mode");
  const typingMode = document.getElementById("typing-mode");

  chrome.storage.local.get(
    ["wordInterval", "definitionMode", "testMode", "typingMode"],
    (data) => {
      if (data.wordInterval) intervalInput.value = data.wordInterval;
      definitionMode.checked = data.definitionMode || false;
      testMode.checked = data.testMode || false;
      typingMode.checked = data.typingMode || false;
    }
  );

  saveBtn.addEventListener("click", () => {
    const interval = parseFloat(intervalInput.value);

    if (isNaN(interval) || interval < 0.01) {
      status.textContent = "Please enter a valid number (minimum 0.01)!";
      status.style.color = "red";
      return;
    }

    chrome.storage.local.set(
      {
        wordInterval: interval,
        definitionMode: definitionMode.checked,
        testMode: testMode.checked,
        typingMode: typingMode.checked,
      },
      () => {
        status.textContent = "Settings saved!";
        status.style.color = "green";

        chrome.alarms.clear("vocabTimer", () => {
          chrome.alarms.create("vocabTimer", {
            delayInMinutes: interval,
            periodInMinutes: interval,
          });

          setTimeout(() => window.close(), 100);
        });
      }
    );
  });
});
