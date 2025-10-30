// import { generateFormattedData } from "@/lib/utils";
import { useState } from "react";
import { Button } from "./ui/button";

export function Intro() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any>(null)
  const [analysis, setAnalysis] = useState<any>(null)
  console.log({ data })



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
    // const analysis = await generateFormattedData(`Analyze the property details in the following text and give the comparable_sales and rental_estimates for other comparable properties:${data}`)

    const analysis = "Hello analysis"
    console.log({ analysis })
    setAnalysis(analysis)

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
  const bedHead = {
    name: chrome.runtime.getManifest().name,
    version: chrome.runtime.getManifest().version,
    description: chrome.runtime.getManifest().description,
    icon: chrome.runtime.getManifest().action.default_icon[128],
  };

  return (
    <div className="flex flex-col items-center justify-center min-w-[360px] min-h-[400px] w-full h-full bg-background overflow-y-auto">
      <div className="flex flex-col w-max gap-[1em]">
        <h2 className="font-bold text-lg mb-2">Property Analyzer</h2>

        {/* {data ?
          <PropertyDetails data={data} /> : 
        
          {/* } */}
        <p>Hello world</p>
        <div className="flex gap-2">
          {/* <Button onClick={analyzePage} disabled={loading} variant="outline" size="sm" className="text-white">
            {loading ? "Analyzing..." : "Analyze page"}
          </Button>
          <Button disabled={loading} variant="outline" size="sm">
            Add to CRM
          </Button> */}
          <Button>Testing</Button>
          <button>Testing 2</button>
        </div>
        {/* <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FolderArchive />
            </EmptyMedia>
            <EmptyTitle>Property Details Not Fetched</EmptyTitle>
            <EmptyDescription>
              Analyze the property details on this page to get summary and insights, comparable sales and rental estimates.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent >
            <div className="flex gap-2">

              <Button onClick={analyzePage} disabled={loading} variant="outline" size="sm" className="bg-blue-500 text-white">
                {loading ? "Analyzing..." : "Analyze page"}
              </Button>
              <Button disabled={loading} variant="outline" size="sm">
                Add to CRM
              </Button>
            </div>
          </EmptyContent>
        </Empty> */}
      </div>
    </div>
  );
}
