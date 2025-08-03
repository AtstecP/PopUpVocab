const PERIOD_MIN = 0.01;

chrome.runtime.onInstalled.addListener(() => {
  resetTimer();
  setupAlarm();
});

function setupAlarm() {
  chrome.alarms.create('vocabTimer', {
    delayInMinutes: 0,
    periodInMinutes: PERIOD_MIN
  });
}

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'vocabTimer') {
    await checkTimer();
  }
});

async function checkTimer() {
  const result = await chrome.storage.local.get(['vocab_next_time']);
  if (!result.vocab_next_time || result.vocab_next_time <= Date.now()) {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab) return;
    
    try {
      // 1. First inject the content script
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
      });
      
      // 2. Add slight delay to ensure content script is ready
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // 3. Send message with retry logic
      await sendMessageWithRetry(tab.id, { action: 'showPopup' });
    } catch (error) {
      console.error("Final error after retries:", error);
    }
    
    resetTimer();
  }
}

// Helper function with retry logic
async function sendMessageWithRetry(tabId, message, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      await chrome.tabs.sendMessage(tabId, message);
      return; // Success!
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 200 * (i + 1)));
    }
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'resetTimer') {
    resetTimer();
    sendResponse({ success: true });
  }
  return true;
});

function resetTimer() {
  const nextTime = Date.now() + PERIOD_MIN * 60 * 1000;
  chrome.storage.local.set({ vocab_next_time: nextTime });
}