import chunk_001 from './vocab_build/output_chunks/chunk_001.json';
import chunk_002 from './vocab_build/output_chunks/chunk_002.json';
import chunk_003 from './vocab_build/output_chunks/chunk_003.json';
import chunk_004 from './vocab_build/output_chunks/chunk_004.json';
import chunk_005 from './vocab_build/output_chunks/chunk_005.json';
import chunk_006 from './vocab_build/output_chunks/chunk_006.json';
import chunk_007 from './vocab_build/output_chunks/chunk_007.json';
import chunk_008 from './vocab_build/output_chunks/chunk_008.json';
import chunk_009 from './vocab_build/output_chunks/chunk_009.json';
import chunk_010 from './vocab_build/output_chunks/chunk_010.json';
import chunk_011 from './vocab_build/output_chunks/chunk_011.json';
import chunk_012 from './vocab_build/output_chunks/chunk_012.json';
import chunk_013 from './vocab_build/output_chunks/chunk_013.json';
import chunk_014 from './vocab_build/output_chunks/chunk_014.json';

const allChunks = [
  chunk_001, chunk_002, chunk_003, chunk_004, chunk_005, chunk_006, chunk_007,
  chunk_008, chunk_009, chunk_010, chunk_011, chunk_012, chunk_013, chunk_014
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
