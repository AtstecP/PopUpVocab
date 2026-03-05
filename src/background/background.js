const PERIOD_MIN = 15;

// ==========================================
// 1. INSTALLATION & SETUP
// ==========================================
chrome.runtime.onInstalled.addListener(async () => {
  // Wait for defaults to be saved FIRST to avoid race conditions
  await chrome.storage.local.set({
    definitionMode: true,
    testMode: true,
    typingMode: true,
    wordInterval: PERIOD_MIN,
    vocabWords: [] 
  });

  // THEN setup timers relying on those defaults
  await resetTimer();
  await setupAlarm();
});

// ==========================================
// 2. ALARM MANAGEMENT
// ==========================================
async function setupAlarm() {
  const { wordInterval } = await chrome.storage.local.get(["wordInterval"]);
  
  await chrome.alarms.clear("vocabTimer"); 
  chrome.alarms.create("vocabTimer", {
    delayInMinutes: 0,
    periodInMinutes: wordInterval,
  });
}

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === "vocabTimer") {
    await checkTimer();
  }
});

// ==========================================
// 3. STORAGE LISTENER
// ==========================================
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local" && changes.wordInterval) {
    console.log("Interval changed:", changes.wordInterval.newValue);
    setupAlarm();
    resetTimer();
  }
});

// ==========================================
// 4. TIMER LOGIC & POPUP TRIGGER
// ==========================================
async function checkTimer() {
  const result = await chrome.storage.local.get(["vocab_next_time"]);
  
  if (!result.vocab_next_time || result.vocab_next_time <= Date.now()) {
    
    // ALWAYS reset the timer if we made it inside this block
    await resetTimer(); 

    const modeData = await chrome.storage.local.get([
      "definitionMode",
      "testMode",
      "typingMode"
    ]);

    const anyModeEnabled =
      modeData.definitionMode ||
      modeData.testMode ||
      modeData.typingMode;

    if (!anyModeEnabled) {
      console.log("No mode selected → popup not shown.");
      return; 
    }

    // 1. FIRST, get the active tab
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    // 2. THEN, run the safety check (including !tab.url)
    if (!tab || !tab.id || !tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('edge://')) {
        console.log("Invalid tab for popup injection.");
        return;
    }

    // 3. FINALLY, send the message
    try {
      await sendMessageWithRetry(tab.id, { action: "showPopup" });
    } catch (error) {
      console.error("Final error after retries:", error);
    }
  }
}

// ==========================================
// 5. MESSAGING UTILITIES
// ==========================================
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
    // Wait for the async function to resolve before sending the response
    resetTimer().then(() => {
      sendResponse({ success: true });
    });
    return true; // Required to keep the message channel open for async responses
  }
});

// ==========================================
// 6. TIMER RESET UTILITY
// ==========================================
async function resetTimer() {
  const { wordInterval } = await chrome.storage.local.get(["wordInterval"]);
  
  // Safety fallback: use PERIOD_MIN if wordInterval is undefined
  const interval = wordInterval || PERIOD_MIN; 
  
  const nextTime = Date.now() + interval * 60 * 1000;
  await chrome.storage.local.set({ vocab_next_time: nextTime });
}