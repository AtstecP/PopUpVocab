(function() {
  const key = 'vocab_next_time';
  
  function showWordPopup() {
    if (document.getElementById('word-popup')) return;

    const popup = document.createElement('div');
    popup.id = 'word-popup';
    
    const wordElement = document.createElement('span');
    wordElement.className = 'word';
    wordElement.textContent = 'Loading word...';
    
    const definitionElement = document.createElement('div');
    definitionElement.className = 'definition';
    definitionElement.textContent = 'Loading definition...';
    
    const nextBtn = document.createElement('button');
    nextBtn.id = 'next-word-btn';
    nextBtn.textContent = 'Next (1 min)';

    nextBtn.addEventListener('click', () => {
      const nextTime = Date.now() + 1 * 60 * 1000;
      chrome.storage.local.set({ vocab_next_time: nextTime }, () => {
        popup.remove();
      });
    });

    popup.appendChild(wordElement);
    popup.appendChild(definitionElement);
    popup.appendChild(nextBtn);
    document.body.appendChild(popup);

    fetch('https://random-word-api.herokuapp.com/word')
      .then(response => response.json())
      .then(([randomWord]) => {
        wordElement.textContent = randomWord;
        return fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${randomWord}`);
      })
      .then(response => response.json())
      .then(data => {
        const firstDefinition = data[0]?.meanings[0]?.definitions[0]?.definition;
        definitionElement.textContent = firstDefinition || "No definition available";
      })
      .catch(err => {
        console.error(err);
        definitionElement.textContent = "Couldn't load definition";
      });
  }

  // Check storage every second
  setInterval(() => {
    chrome.storage.local.get([key], (result) => {
      const now = Date.now();
      const nextTime = result[key];
      if (!nextTime || now >= nextTime) {
        showWordPopup();
      }
    });
  }, 1000);
})();