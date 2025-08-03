import { initFloatingButton } from './open_button.js';
import "./content.css";

// Add this to ensure the content script is properly loaded
console.log("Content script loaded and ready");

// Make sure the listener is set up immediately
const messageListener = (request) => {
  if (request.action === "showPopup") {
    initFloatingButton();
  }
};

chrome.runtime.onMessage.addListener(messageListener);

// Clean up listener when script unloads (optional)
window.addEventListener('unload', () => {
  chrome.runtime.onMessage.removeListener(messageListener);
});