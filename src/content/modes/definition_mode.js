export function runDefinitionMode(vocabDict, wordElement, definitionElement) {
  const words = Object.keys(vocabDict);
  if (words.length === 0) return;

  const word = getRandom(words);
  
  const def = vocabDict[word].definition;
  const partSpe = vocabDict[word].partOfSpeech;
  
  wordElement.textContent = word;
  definitionElement.textContent = `${partSpe} - ${def}`;
}

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}