import vocabData from '../vocab_build/test_vocab.json';
//import vocabData from '../japanes/words.json';

export async function runDefinitionMode(wordElement, definitionElement) {
  const words = Object.keys(vocabData);
  const correctWord = getRandom(words);
  const correctDef = vocabData[correctWord].definition;

  wordElement.textContent = correctWord;
  definitionElement.textContent = correctDef;
}

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
