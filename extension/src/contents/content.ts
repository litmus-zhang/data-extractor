export {}
console.log(
  "You may find that having is not so pleasing a thing as wanting. This is not logical, but it is often true."
)

// src/contents/content.ts
console.log("Content script running on:", window.location.href)

// Example: extract page title, URL, and visible text
const pageData = {
  url: window.location.href,
  title: document.title,
  content: document.body.innerText.slice(0, 2000) // limit text length
}

console.log({pageData})

// Send it to the background service worker
chrome.runtime.sendMessage({ type: "PAGE_DATA", payload: pageData })
