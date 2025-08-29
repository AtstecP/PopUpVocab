const PERIOD_MIN = 15;

chrome.runtime.onInstalled.addListener(() => {
  resetTimer();
  setupAlarm();
  chrome.storage.local.set({
    definitionMode: true,
    testMode: true,
    typingMode: true,
    wordInterval: PERIOD_MIN,
  });
});

async function setupAlarm() {
  const { wordInterval } = await chrome.storage.local.get(["wordInterval"]);
  const interval = wordInterval;

  chrome.alarms.clear("vocabTimer", () => {
    chrome.alarms.create("vocabTimer", {
      delayInMinutes: 0,
      periodInMinutes: interval,
    });
  });
}

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === "vocabTimer") {
    await checkTimer();
  }
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local" && changes.wordInterval) {
    console.log("Interval changed:", changes.wordInterval.newValue);
    setupAlarm();
    resetTimer();
  }
});

async function checkTimer() {
  const result = await chrome.storage.local.get(["vocab_next_time"]);
  if (!result.vocab_next_time || result.vocab_next_time <= Date.now()) {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (!tab || !tab.id) return;

    try {
      await sendMessageWithRetry(tab.id, { action: "showPopup" });
    } catch (error) {
      console.error("Final error after retries:", error);
    }

    resetTimer();
  }
}

async function sendMessageWithRetry(tabId, message, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      await chrome.tabs.sendMessage(tabId, message);
      return;
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, 200 * (i + 1)));
    }
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "resetTimer") {
    resetTimer();
    sendResponse({ success: true });
  }
  return true;
});

async function resetTimer() {
  const { wordInterval } = await chrome.storage.local.get(["wordInterval"]);
  const interval = wordInterval;
  const nextTime = Date.now() + interval * 60 * 1000;
  chrome.storage.local.set({ vocab_next_time: nextTime });
}
