import chunk_001 from './vocab_build/test_vocab.json';


const allChunks = [
  chunk_001
];

export function loadWord(wordElement, definitionElement) {
  const chunkData = getRandom(allChunks);
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
      allButtons.forEach((b) => {
        b.disabled = true;
        if (b.textContent === correctAnswer) {
          b.style.backgroundColor = 'green';
          b.style.color = 'white';
        } else if (b === btn) {
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
