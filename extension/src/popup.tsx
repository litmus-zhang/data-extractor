import { authClient } from "./auth/auth-client"


import "./style.css"
import { SignupForm } from "./components/signup-form";
import { Button } from "./components/ui/button";
import { useState } from "react";

function IndexPopup() {
  // const { data, isPending, error } = authClient.useSession();
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<any>(null)

  const analyzePage = async () => {
    setLoading(true)
    setResponse(null)

    // Step 1: Get data from active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id! },
      func: () => ({
        url: window.location.href,
        title: document.title,
        content: document.body.innerText.slice(0, 1500)
      })
    })

    const pageData = results[0].result

    // Step 2: Send data to your Elysia backend
    try {
      // const res = await fetch(`${API_BASE}/api/analyze`, {
      const res = await fetch(`${process.env.PLASMO_PUBLIC_API_URL}/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pageData)
      })
      const data = await res.json()

      // Step 3: Show backend response in popup
      setResponse(data)
    } catch (err) {
      console.error("Error sending data:", err)
      setResponse({ error: "Failed to reach backend" })
    } finally {
      setLoading(false)
    }
  }
  // console.log({ data, isPending, error });
  // if (isPending) {
  //   return <div className="flex items-center justify-center h-[500px] w-[400px] flex-col gap-4 p-4">Loading...</div>
  // }
  // if (error) {
  //   return (
  //     <div className="flex items-center justify-center h-[500px] w-[400px] flex-col gap-4 p-4">
  //       Error: {error.message}
  //     </div>
  //   )
  // }
  // if (data) {
  //   return <div className="flex items-center justify-center h-[500px] w-[400px] flex-col gap-4 p-4">Signed in as {data.user.name}</div>
  // }
  return (
    <div className="flex items-center justify-center h-[500px] w-[400px] flex-col gap-4 p-4 overflow-y-auto ">
      {/* <h1 className="text-2xl font-bold">Popup page</h1>
        <SignupForm /> */}
      <h2 className="font-bold text-lg mb-2">Page Analyzer</h2>
      <Button
        onClick={analyzePage}
        disabled={loading}
        className="bg-blue-600 text-white px-3 py-2 rounded w-full"
      >
        {loading ? "Analyzing..." : "Analyze This Page"}
      </Button>

      {response && (
        <div className="mt-3 p-2 border rounded bg-gray-50 max-w-[400px] overflow-auto">
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  )

}

export default IndexPopup
