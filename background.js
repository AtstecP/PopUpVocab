chrome.runtime.onInstalled.addListener(() => {
  resetTimer();
  setupAlarm();
});

function setupAlarm() {
  chrome.alarms.create('vocabTimer', {
    delayInMinutes: 0,    
    periodInMinutes: 1
  });
}

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'vocabTimer') {
    checkTimer();
  }
});

function checkTimer() {
  chrome.storage.local.get(['vocab_next_time'], (result) => {
    if (!result.vocab_next_time || result.vocab_next_time <= Date.now()) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
          chrome.tabs.sendMessage(tabs[0].id, { action: 'showPopup' });
        }
      });

      resetTimer();
    }
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'resetTimer') {
    resetTimer();
    sendResponse({ success: true });
  }
});

function resetTimer() {
  const nextTime = Date.now() + 1 * 60 * 1000; 
  chrome.storage.local.set({ vocab_next_time: nextTime });
}
