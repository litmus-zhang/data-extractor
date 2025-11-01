import { PromptResponseSchema } from "@/lib/types";
import { jsonrepair } from "jsonrepair";

console.log("[SW] running")
chrome.runtime.onInstalled.addListener((details): void => {
  console.log("[service-worker.ts] > onInstalled", details);
});

chrome.action.onClicked.addListener((tab: chrome.tabs.Tab): void => {
  chrome.tabs.sendMessage(
    tab.id ?? 0,
    {
      type: "browser-action",
      action: "open-or-close-extension",
    },
    (response) => {
      console.log("chrome.action.onClicked.addListener > response:", response);
    },
  );
});



// Define default values for topK and temperature within the application
const DEFAULT_TOP_K = 3;
const DEFAULT_TEMPERATURE = 1;
let session;

async function createAISession({ initialPrompts = [], topK = 3, temperature = 1 } = {}){
  if (!LanguageModel) {
  console.warn("[SW] The Prompt API (LanguageModel) is not available in this context.");
  return;
}
  const { available, defaultTopK, maxTopK, defaultTemperature } =
    await LanguageModel.availability();
  // "readily", "after-download", or "no"
  if (available === "no") {
    return Promise.reject(new Error('AI not available'));
  }
  const params = {
    monitor(monitor) {
      monitor.addEventListener('downloadprogress', event => {
        console.log(`Downloaded: ${event.loaded} of ${event.total} bytes.`);
      });
    },
    initialPrompts: initialPrompts || '',
    topK: topK || defaultTopK,
    temperature: temperature || defaultTemperature,
  };
  session = await LanguageModel.create(params);
  return session;
}

async function updateSession({ initialPrompts, topK, temperature } = {
  topK: DEFAULT_TOP_K,
  temperature: DEFAULT_TEMPERATURE,
}) {
  if (session) {
    session.destroy();
    session = null;
  }
  session = await createAISession({
    initialPrompts,
    topK,
    temperature,
  });
}

async function generateFormattedData(api_response: string) {
  // Initialize the model session
  await updateSession({
    initialPrompts: [
      {
        role: 'system',
        content: `Format the following data into a JSON object.`,
      }
    ],

  });
  const prompt = `Format the data below into a formatted JSON object with the following schema: ${PromptResponseSchema}: ${api_response}`;
  const result = await session!.prompt(prompt, { responseConstraint: PromptResponseSchema, });
  try {
    // const fixedJson = jsonrepair(result);
    // display result
    return result
  } catch (error) {
    // display error
    throw new Error("Error getting response" + error.message)
  }
}

// export { generateFormattedData }
 const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000"


// src/background/index.ts
chrome.runtime.onMessage.addListener(async (message, sender) => {
  if (message.type === "PAGE_CONTENT") {
    const { payload } = message

    console.log({ payload })

    try {
      const response = await fetch(`${API_URL}/api/analyze`, {
      // const response = await fetch(`/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      const result = await response.json()
      console.log("[SW] Raw backend result:", result);

      const formatted = await generateFormattedData(result);
      // const formatted = await generateFormattedData( JSON.stringify(payload));


      // Store response in chrome storage
      await chrome.storage.local.set({
        lastRawResponse: result,
        lastFormattedResponse: JSON.parse(formatted),
      });

      console.log("[SW] ✅ Saved formatted response:", formatted);
      console.log("Saved response from backend:", result)
    } catch (error) {
      console.error("Failed to send data to backend:", error)
    }
  }
})
