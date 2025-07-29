(function () {
  if (document.getElementById('word-popup')) return;

  const popup = document.createElement('div');
  popup.id = 'word-popup';

  const word = document.createElement('span');
  word.textContent = 'Loading...';

  const definition = document.createElement('p');
  definition.id = 'word-definition';

  const nextBtn = document.createElement('button');
  nextBtn.textContent = 'Next';
  nextBtn.onclick = loadWord;

  popup.appendChild(word);
  popup.appendChild(definition);
  popup.appendChild(nextBtn);
  document.body.appendChild(popup);

  makeDraggable(popup); 
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

  function makeDraggable(element) {
    let offsetX = 0, offsetY = 0, isDragging = false;

    element.addEventListener('mousedown', (e) => {
      isDragging = true;
      offsetX = e.clientX - element.offsetLeft;
      offsetY = e.clientY - element.offsetTop;
      element.style.cursor = 'grabbing';
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      element.style.left = `${e.clientX - offsetX}px`;
      element.style.top = `${e.clientY - offsetY}px`;
      element.style.right = 'auto';
      element.style.bottom = 'auto';
      element.style.position = 'fixed';
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
      element.style.cursor = 'grab';
    });
  }
})();
