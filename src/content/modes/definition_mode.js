// import vocabData from '../vocab_build/test_vocab.json';
//import vocabData from '../japanes/words.json';

export function runDefinitionMode(vocabArray, wordElement, definitionElement) {
  const randomEntry = getRandom(vocabArray);
  const word = Object.keys(randomEntry)[0]; 
  const def = randomEntry[word].definition;
  const partSpe = randomEntry[word].partOfSpeech;
  wordElement.textContent = word;
  definitionElement.textContent = `${partSpe} - ${def}`;
}

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}