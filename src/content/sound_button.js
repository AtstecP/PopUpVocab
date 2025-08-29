export function addSoundButton(popup, wordElement) {
  const soundBtn = document.createElement("button");
  soundBtn.className = "sound-btn";
  soundBtn.textContent = "🔊";
  speak(wordElement.textContent)
  soundBtn.onclick = () => {
    //if (!wordElement.textContent || wordElement.textContent === "Loading...") return;
    speak(wordElement.textContent)
  };

  popup.appendChild(soundBtn);
}

function speak(word){
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "fr-FR";
  speechSynthesis.rate = 0.5
  speechSynthesis.speak(utterance);
};

/*

language code is ​"de-DE" for language ​" Deutsch"

language code is ​"en-US" for language ​" US English"

language code is ​"en-GB" for language ​" UK English Female"​

language code is ​"en-GB" for language ​" UK English Male"​

language code is ​"es-ES" for language ​" español"

language code is ​"es-US" for language ​" español de Estados Unidos"

language code is ​"fr-FR" for language ​" français"​

language code is ​"hi-IN" for language ​" हिन्दी Hindi"

language code is ​"id-ID" for language ​" Bahasa Indonesia"

language code is ​"it-IT" for language ​" italiano"

language code is ​"ja-JP" for language ​" 日本語"

language code is ​"ko-KR" for language ​" 한국의"

language code is ​"nl-NL" for language ​" Nederlands"

language code is ​"pl-PL" for language ​" polski"

language code is ​"pt-BR" for language ​" português do Brasil"

language code is ​"ru-RU" for language ​" русский"

language code is ​"zh-CN" for language ​" ​普通话（中国大陆）"

language code is ​"zh-HK" for language ​" ​粤語（香港）"

language code is ​"zh-TW" for language ​" 國語（臺灣）"
*/