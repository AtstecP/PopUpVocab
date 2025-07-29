// Debugging check
console.log('Background script loaded');
console.log('chrome.alarms available?', !!chrome.alarms);

chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed/updated');
  try {
    chrome.alarms.create('vocabTimer', {
      delayInMinutes: 1,
      periodInMinutes: 1
    });
    console.log('Alarm created successfully');
  } catch (error) {
    console.error('Error creating alarm:', error);
  }
});

if (chrome.alarms) {
  chrome.alarms.onAlarm.addListener((alarm) => {
    console.log('Alarm triggered:', alarm.name);
    if (alarm.name === 'vocabTimer') {
      chrome.storage.local.set({ vocab_next_time: Date.now() });
      console.log('⏰ 1 минута прошла — можно показать слово');
    }
  });
} else {
  console.error('chrome.alarms API not available');
}