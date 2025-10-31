// import { generateFormattedData } from "@/lib/utils";
import { PromptResponseSchema } from "@/lib/types";
import { jsonrepair } from "jsonrepair";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

import { PropertyDetails } from "./PropertyDetails";
import { Spinner } from "./ui/spinner";

export function Intro() {
  const [analysis, setAnalysis] = useState<any>(null)
  console.log({ analysis })
  const [response, setResponse] = useState<any>(null)

  useEffect(() => {
    chrome.storage.local.get("lastResponse", (data) => {
      setResponse(data.lastResponse)
    })
  }, [])

  //   if (!LanguageModel) {
  //   // Detect the feature and display "Not Supported" message as needed
  //   return;
  // }
  // // Define default values for topK and temperature within the application
  // const DEFAULT_TOP_K = 3;
  // const DEFAULT_TEMPERATURE = 1;
  // let session;

  // async function createAISession({ initialPrompts, topK, temperature } = {}) {
  //   const { available, defaultTopK, maxTopK, defaultTemperature } =
  //     await LanguageModel.availability();
  //   // "readily", "after-download", or "no"
  //   if (available === "no") {
  //     return Promise.reject(new Error('AI not available'));
  //   }
  //   const params = {
  //     monitor(monitor) {
  //       monitor.addEventListener('downloadprogress', event => {
  //         console.log(`Downloaded: ${event.loaded} of ${event.total} bytes.`);
  //       });
  //     },
  //     initialPrompts: initialPrompts || '',
  //     topK: topK || defaultTopK,
  //     temperature: temperature || defaultTemperature,
  //   };
  //   session = await LanguageModel.create(params);
  //   return session;
  // }

  // async function updateSession({ initialPrompts, topK, temperature } = {
  //   topK: DEFAULT_TOP_K,
  //   temperature: DEFAULT_TEMPERATURE,
  // }) {
  //   if (session) {
  //     session.destroy();
  //     session = null;
  //   }
  //   session = await createAISession({
  //     initialPrompts,
  //     topK,
  //     temperature,
  //   });
  // }

  // async function generateFormattedData(api_response: string) {
  //   // Initialize the model session
  //   await updateSession({
  //     initialPrompts: [
  //       {
  //         role: 'system',
  //         content: `Format the following data into a JSON object.`,
  //       }
  //     ],

  //   });
  //   const prompt = `Format the data below into a formatted JSON object: ${api_response}`;
  //   const result = await session!.prompt(prompt, { responseConstraint: PromptResponseSchema, });
  //   try {
  //     const fixedJson = jsonrepair(result);
  //     // display result
  //     return fixedJson
  //   } catch (error) {
  //     // display error
  //     throw new Error("Error getting response" + error.message)
  //   }
  // }




  const bedHead = {
    name: chrome.runtime.getManifest().name,
    version: chrome.runtime.getManifest().version,
    description: chrome.runtime.getManifest().description,
    icon: chrome.runtime.getManifest().action.default_icon[128],
  };


  return (
    <div className="flex flex-col items-center justify-center min-w-[360px] min-h-[500px] w-full h-full bg-background p-4 overflow-y-auto">
      {/* <div className="flex flex-col w-max gap-[1em]"> */}
      <h2 className="font-bold text-lg mb-2">{bedHead.name.charAt(0).toUpperCase() + bedHead.name.slice(1)}</h2>
      <p className="text-sm text-gray-500 mb-4">version {bedHead.version}</p>

      {
        response ?  <PropertyDetails data={response} /> : <Button disabled size="sm">
          <Spinner />
          Loading Data...
        </Button>
      }
    </div>
  );
}
