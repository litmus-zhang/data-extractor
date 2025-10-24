export { }
console.log(
  "You may find that having is not so pleasing a thing as wanting. This is not logical, but it is often true."
)

import type { PlasmoCSConfig } from "plasmo"
import { sendToBackground } from "@plasmohq/messaging"


export const config: PlasmoCSConfig = {
  matches: ["https://www.onthemarket.com/*", "https://www.zillow.com/*", "https://www.bayut.com/", "https://jiji.ng/*"],
  all_frames: true
}
// src/contents/content.ts
console.log("Content script running on:", window.location.href)

// Example: extract page title, URL, and visible text
const pageData = {
  url: window.location.href,
  title: document.title,
  content: document.body.innerText.slice(0, 2000) // limit text length
}

console.log({ pageData })


// Send it to the background service worker
chrome.runtime.sendMessage({ type: "PAGE_DATA", payload: pageData })

chrome.runtime.sendMessage({
  type: "CAPTURE_PAGE", payload: {
    url: window.location.href,
    title: document.title,
    content: document.body.innerText.slice(0, 2000)
  }
})

const resp = await sendToBackground({
  name: "page_data",
  body: pageData
})
 
console.log(resp)
