import { initFloatingButton } from './open_button.js';
import "./content.css";


chrome.storage.local.get(["definitionMode", "testMode", "typingMode"], (data) => {
  const anyModeEnabled = data.definitionMode || data.testMode || data.typingMode;

  if (anyModeEnabled) {
    const messageListener = (request) => {
      if (request.action === "showPopup") {
        initFloatingButton();
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);
  }
});

// Clean up listener when script unloads (optional)
// window.addEventListener('unload', () => {
//   chrome.runtime.onMessage.removeListener(messageListener);
// });