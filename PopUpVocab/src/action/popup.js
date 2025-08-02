document.getElementById("next").addEventListener("click", () => {
  const nextTime = Date.now() + 15 * 60 * 1000;
  chrome.storage.local.set({ vocab_next_time: nextTime }, () => {
    console.log('🔁 Таймер сброшен на 15 минут');
  });
});
