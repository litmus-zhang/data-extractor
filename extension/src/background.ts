export {}
 
console.log(
  "Live now; make now always the most precious time. Now will never come again."
)
// src/background.ts
const API_BASE = process.env.PLASMO_PUBLIC_API_URL || "http://localhost:4000"

chrome.runtime.onMessage.addListener(async (message, sender) => {
  if (message.type === "PAGE_DATA") {
    console.log("Received page data:", message.payload)

    try {
      const res = await fetch(`${API_BASE}/api/capture`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message.payload)
      })

      console.log("Sent to backend:", res.status)
    } catch (err) {
      console.error("Failed to send page data:", err)
    }
  }
})
