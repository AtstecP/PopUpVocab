export function runTestMode(vocabData, wordElement, definitionElement) {
  const words = Object.keys(vocabData);

  // We need at least 4 words to generate 1 correct and 3 wrong options.
  if (words.length < 4) {
    wordElement.textContent = "Not enough words";
    definitionElement.innerHTML = "<p>Please add at least 4 words to your vocabulary list to use Test Mode.</p>";
    return; // Exit early
  }

  const correctWord = getRandom(words);
  const correctDef = vocabData[correctWord].definition;

  const wrongDefs = [];
  
  // SAFE LOOP: Gather exactly 3 UNIQUE wrong definitions
  while (wrongDefs.length < 3) {
    const candidate = getRandom(words);
    const candidateDef = vocabData[candidate].definition;
    
    // Ensure the candidate isn't the correct answer AND isn't already in our list
    if (candidateDef !== correctDef && !wrongDefs.includes(candidateDef)) {
      wrongDefs.push(candidateDef);
    }
  }

  // Combine the correct answer with the wrong ones and shuffle
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
      //  Evaluate the answer ONCE outside the loop
      const isCorrect = btn.textContent === correctAnswer;
      
      // Play the appropriate sound ONCE
      if (isCorrect) {
        new Audio(chrome.runtime.getURL("sounds/correct.mp3")).play();
      } else {
        new Audio(chrome.runtime.getURL("sounds/wrong.mp3")).play();
      }

      // Update the UI: Loop through all buttons to disable and color them
      const allButtons = container.querySelectorAll('button');
      allButtons.forEach((b) => {
        b.disabled = true; // Lock all buttons after a guess
        
        if (b.textContent === correctAnswer) {
          b.style.backgroundColor = 'green';
          b.style.color = 'white';
        } else if (b === btn) {
          // Only highlight the wrong answer they actually clicked
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