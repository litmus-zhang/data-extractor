import { authClient } from "./auth/auth-client"


import "./style.css"
import { Button } from "./components/ui/button";
import { FolderArchive } from "lucide-react"
import React, { useEffect, useState } from "react"
import { PropertyDetails } from "./components/PropertyDetails";
import { usePort } from "@plasmohq/messaging/hook"
import { Terminal } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./components/ui/alert";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "./components/ui/empty";
import { generateFormattedData } from "./lib/utils";



function IndexPopup() {
  // const { data, isPending, error } = authClient.useSession();
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any>(null)
  const [analysis, setAnalysis] = useState<any>(null)
  console.log({ data })

  // const [response, setResponse] = useState<any>(null)

  // let session;

  // const availability = await LanguageModel.availability();

  // console.log({availability})

  // async function runPrompt(prompt, params) {
  //   try {
  //     if (!session) {
  //       session = await LanguageModel.create({
  //         monitor(m) {
  //           m.addEventListener('downloadprogress', (e) => {
  //             console.log(`Downloaded ${e.loaded * 100}%`);
  //           });
  //         },
  //         initialPrompts: [
  //           { role: 'system', content: 'You are a helpful and friendly property analyst.' },
  //         ]
  //       });
  //     }
  //     return session.prompt(prompt, {
  //       responseConstraint: PromptResponseSchema,
  //     });
  //   } catch (e) {
  //     console.log('Prompt failed');
  //     console.error(e);
  //     console.log('Prompt:', prompt);
  //     // Reset session
  //     reset();
  //     throw e;
  //   }
  // }



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
    const analysis = await generateFormattedData(`Analyze the property details in the following text and give the comparable_sales and rental_estimates for other comparable properties:${data}`)

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

  return (
    <div className="flex items-center justify-center h-[500px] w-[400px] flex-col gap-4 p-4 overflow-y-auto ">
      <h2 className="font-bold text-lg mb-2">Property Analyzer</h2>

      {data ?
        <PropertyDetails data={data} /> : <Empty className="border border-dashed">
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
        </Empty>
      }
    </div>
  )

}

export default IndexPopup