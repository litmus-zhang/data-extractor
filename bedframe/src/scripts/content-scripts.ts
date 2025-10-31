// src/content/index.ts
console.log("Content script loaded on:", window.location.href)

function extractPageData() {
  return {
    url: window.location.href,
    title: document.title,
    content: document.body.innerText.slice(0, 2000) // limit size
  }
}

// Send the content to background once page fully loads
window.addEventListener("load", () => {
  const data = extractPageData()
  chrome.runtime.sendMessage({ type: "PAGE_CONTENT", payload: data })
})


console.log("page data: ",extractPageData())