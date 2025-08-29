// import vocabData from '../vocab_build/test_vocab.json';
//import vocabData from '../japanes/words.json';

export function runDefinitionMode(vocabData, wordElement, definitionElement) {
  const words = Object.keys(vocabData);
  const word = getRandom(words);
  const def = vocabData[word].definition;
  const partSpe = vocabData[word].partOfSpeech;

  wordElement.textContent = word;
  definitionElement.textContent = `${partSpe} - ${def}`;
}

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
