// import { generateFormattedData } from "@/lib/utils";
import { PromptResponseSchema } from "@/lib/types";
import { jsonrepair } from "jsonrepair";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

import { PropertyDetails } from "./PropertyDetails";
import { Spinner } from "./ui/spinner";

export function Intro() {
  const [response, setResponse] = useState<any>(null)

  useEffect(() => {
    chrome.storage.local.get("lastFormattedResponse", (data) => {
      setResponse(data.lastFormattedResponse)
    })
  }, [])

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
