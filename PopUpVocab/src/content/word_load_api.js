export async function loadWord(word, definition) {
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
      definition.textContent = dictData[0]?.meanings[0]?.definitions[0]?.definition || 'No definition found.';
    } catch (err) {
      word.textContent = 'Error!';
      definition.textContent = 'Something went wrong.';
      console.error(err);
    }
  }