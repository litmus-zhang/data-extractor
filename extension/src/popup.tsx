import { authClient } from "./auth/auth-client"


import "./style.css"
import { SignupForm } from "./components/signup-form";
import { Button } from "./components/ui/button";
import React, { useEffect, useState } from "react"
import { PropertyDetails } from "./components/PropertyDetails";
import { usePort } from "@plasmohq/messaging/hook"



function IndexPopup() {
  // const { data, isPending, error } = authClient.useSession();
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any>(null)
  const prop_data = usePort("prop_data")
  console.log({ data })

  // const [response, setResponse] = useState<any>(null)

  const analyzePage = async () => {
    setLoading(true)
    setData(null)

    // Step 1: Get data from active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id! },
      func: () => ({
        url: window.location.href,
        title: document.title,
        content: document.body.innerText.slice(0, 2000)
      })
    })

    const pageData = results[0].result

    try {
      const res = await fetch(`${process.env.PLASMO_PUBLIC_API_URL}/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pageData)
      })
      const data = await res.json()

      setData(data)
    } catch (err) {
      console.error("Error sending data:", err)
      setData({ error: "Failed to reach backend" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center h-[500px] w-[400px] flex-col gap-4 p-4 overflow-y-auto ">
      {/* <h1 className="text-2xl font-bold">Popup page</h1>
        <SignupForm /> */}
      <h2 className="font-bold text-lg mb-2">Property Analyzer</h2>
      <div className="flex gap-2">

        <Button
          onClick={analyzePage}
          disabled={loading}
          className="bg-blue-600 text-white px-3 py-2 rounded w-full"
        >
          {loading ? "Analyzing..." : "Analyze This Page"}
        </Button>
        <Button
          // onClick={analyzePage}
          disabled={loading}
          className="bg-blue-600 text-white px-3 py-2 rounded w-full"
        >
          {loading ? "Analyzing..." : "Add to CRM"}
        </Button>
      </div>
{/* 
      <Button
        onClick={async () => {
          prop_data.send({
            url: window.location.href,
            title: document.title,
            content: document.body.innerText.slice(0, 1500)
          })
        }}
        className="bg-red-600 text-white px-3 py-2 rounded w-full"
      >
        Get Prop Data
      </Button> */}

      {/* {prop_data && (
        <div className="mt-3 p-2 border rounded bg-gray-50 max-w-[400px] overflow-auto">
          <pre>{JSON.stringify(prop_data, null, 2)}</pre>
        </div>
      )} */}
      {data &&
        <PropertyDetails data={data} />
      }
    </div>
  )

}

export default IndexPopup