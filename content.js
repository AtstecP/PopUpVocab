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


  loadWord();

  function loadWord() {
    fetch('https://random-word-api.herokuapp.com/word')
      .then((response) => response.json())
      .then(([w]) => {
        word.textContent = w;
      })
      .catch((err) => {
        word.textContent = 'Error!';
        console.error('Failed to fetch word:', err);
      });
  }
})();
