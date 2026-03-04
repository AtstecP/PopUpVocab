import defaultWords from "./french/new_word.json";

const STORAGE_KEY = "vocabWords";

export function getWords(callback) {
  chrome.storage.local.get([STORAGE_KEY], (result) => {
    if (result[STORAGE_KEY]) {
      callback(result[STORAGE_KEY]);
    } else {

      chrome.storage.local.set({ [STORAGE_KEY]: defaultWords }, () => {
        callback(defaultWords);
      });
    }
  });
}

export function saveWords(words) {
  chrome.storage.local.set({ [STORAGE_KEY]: words });
}

export function addWord(newWord, callback) {
  getWords((words) => {
    words.push(newWord);
    saveWords(words);
    if (callback) callback(words);
  });
}