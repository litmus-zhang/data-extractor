export {}
 
console.log(
  "Live now; make now always the most precious time. Now will never come again."
)
// src/background.ts
const API_BASE = process.env.PLASMO_PUBLIC_API_URL || "http://localhost:4000"

// chrome.runtime.onMessage.addListener(async (message, sender) => {
//   if (message.type === "PAGE_DATA") {
//     console.log("Received page data:", message.payload)

//     try {
//       const res = await fetch(`${process.env.PLASMO_PUBLIC_API_URL}/api/capture`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(message.payload)
//       })

//       console.log("Sent to backend:", res.status)
//     } catch (err) {
//       console.error("Failed to send page data:", err)
//     }
//   }
// })
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.type === "CAPTURE_PAGE") {
    try {
      const res = await fetch( `${process.env.PLASMO_PUBLIC_API_URL}/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message.payload)
      })
      const data = await res.json()
      
      // Send the backend’s response back to popup
      chrome.runtime.sendMessage({ type: "BACKEND_RESPONSE", data })
    } catch (err) {
      console.error("Backend error:", err)
    }
  }
})
