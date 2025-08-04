export function addSoundButton(popup, wordElement) {
  const soundBtn = document.createElement("button");
  soundBtn.className = "sound-btn";
  soundBtn.textContent = "🔊";

  soundBtn.onclick = () => {
    if (!wordElement.textContent || wordElement.textContent === "Loading...") return;
    const utterance = new SpeechSynthesisUtterance(wordElement.textContent);
    utterance.lang = "en-GB";
    speechSynthesis.rate = 0.5
    speechSynthesis.speak(utterance);
  };

  popup.appendChild(soundBtn);
}
