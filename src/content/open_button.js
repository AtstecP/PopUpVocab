import { showWordPopup } from "./popup.js";

export function initFloatingButton() {
  if (document.getElementById("word-popup")) return;
  if (document.getElementById("vocab-float-btn")) return;

  buttonEl = document.createElement("img");
  buttonEl.id = "vocab-float-btn";
  buttonEl.src = chrome.runtime.getURL("images/coala_wall.png");
  buttonEl.alt = "Vocab Button";

  Object.assign(buttonEl.style, {
    position: "fixed",
    bottom: "40px",
    bottom: "0px",
    right: "0px",
    width: "70px",
    height: "70px",
    cursor: "pointer",
    zIndex: "999999",
  });

  buttonEl.addEventListener("click", () => {
    buttonEl.remove();
    showWordPopup();
  });
  document.body.appendChild(buttonEl);
}
