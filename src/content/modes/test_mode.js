// import vocabData from '../vocab_build/test_vocab.json';
//import vocabData from '../japanes/words.json';

// const allChunks = [
//   vocabData
// ];

export function runTestMode(vocabData, wordElement, definitionElement) {
  //const chunkData = getRandom(vocabData);
  const chunkData = vocabData;
  const words = Object.keys(chunkData);

  const correctWord = getRandom(words);
  const correctDef = chunkData[correctWord].definition;

  const wrongDefs = [];
  while (wrongDefs.length < 3) {
    const candidate = getRandom(words);
    const def = chunkData[candidate].definition;
    if (candidate !== correctWord && !wrongDefs.includes(def)) {
      wrongDefs.push(def);
    }
  }

  const allOptions = shuffle([correctDef, ...wrongDefs]);
  wordElement.textContent = correctWord;
  renderOptions(definitionElement, allOptions, correctDef);
}

function renderOptions(container, options, correctAnswer) {
  container.innerHTML = ''; 

  options.forEach((opt) => {
    const btn = document.createElement('button');
    btn.textContent = opt;
    btn.className = 'option-button';

    btn.onclick = () => {
      const allButtons = container.querySelectorAll('button');
      let isPlayed = false;
      allButtons.forEach((b) => {
        b.disabled = true;
        if (b.textContent === correctAnswer) {
          if (!isPlayed){
            new Audio(chrome.runtime.getURL("sounds/correct.mp3")).play();
            isPlayed = true;
          }
          b.style.backgroundColor = 'green';
          b.style.color = 'white';
        } else if (b === btn) {
          if (!isPlayed){
            new Audio(chrome.runtime.getURL("sounds/wrong.mp3")).play();
            isPlayed = true;
          }
          b.style.backgroundColor = 'red';
          b.style.color = 'white';
        }
      });
    };

    container.appendChild(btn);
  });
}

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(array) {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}
