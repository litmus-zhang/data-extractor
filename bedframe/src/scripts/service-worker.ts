console.log("[SW] running")
chrome.runtime.onInstalled.addListener((details): void => {
  console.log("[service-worker.ts] > onInstalled", details);
});

chrome.action.onClicked.addListener((tab: chrome.tabs.Tab): void => {
  chrome.tabs.sendMessage(
    tab.id ?? 0,
    {
      type: "browser-action",
      action: "open-or-close-extension",
    },
    (response) => {
      console.log("chrome.action.onClicked.addListener > response:", response);
    },
  );
});

 const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000"


// src/background/index.ts
chrome.runtime.onMessage.addListener(async (message, sender) => {
  if (message.type === "PAGE_CONTENT") {
    const { payload } = message

    console.log({ payload })

    try {
      const response = await fetch(`${API_URL}/api/analyze`, {
      // const response = await fetch(`/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      const result = await response.json()

      // Store response in chrome storage
      await chrome.storage.local.set({ lastResponse: result })
      console.log("Saved response from backend:", result)
    } catch (error) {
      console.error("Failed to send data to backend:", error)
    }
  }
})
