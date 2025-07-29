(function () {
  if (document.getElementById('word-popup')) return;

  const popup = document.createElement('div');
  popup.id = 'word-popup';

  const word = document.createElement('span');
  word.textContent = 'Loading...';

  const nextBtn = document.createElement('button');
  nextBtn.textContent = 'Next';
  nextBtn.onclick = loadWord;

  popup.appendChild(word);
  popup.appendChild(nextBtn);
  document.body.appendChild(popup);

  const definition = document.createElement('p');

  popup.appendChild(word);
  popup.appendChild(definition);
  popup.appendChild(nextBtn);



  loadWord();

async function loadWord() {
  word.textContent = 'Loading...';
  definition.textContent = '';

  try {
    const wordResponse = await fetch('https://random-word-api.herokuapp.com/word');
    const [randomWord] = await wordResponse.json();

    word.textContent = randomWord;

    const dictResponse = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${randomWord}`);
    
    if (!dictResponse.ok) {
      definition.textContent = 'No definition found.';
      return;
    }

    const dictData = await dictResponse.json();

    const firstMeaning = dictData[0]?.meanings[0]?.definitions[0]?.definition;

    definition.textContent = firstMeaning || 'No definition found.';
  } catch (err) {
    word.textContent = 'Error!';
    definition.textContent = 'Something went wrong.';
    console.error(err);
  }
}

})();