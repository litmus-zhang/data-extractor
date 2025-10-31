import { clsx, type ClassValue } from "clsx"
import { authClient } from "src/auth/auth-client"
import { twMerge } from "tailwind-merge"
import { PromptResponseSchema } from "./types"
import fixJSON from 'fixjson'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const API_BASE = process.env.PLASMO_PUBLIC_API_URL || "http://localhost:4000"

export async function loginUser(email: string, password: string) {
  const { data, error } = await authClient.signIn.email({ email, password })
  if (error) throw new Error("Failed to login", { cause: error })
  return data
}
export async function registerUser(email: string, password: string, firstName: string, lastName: string) {
  const name = `${firstName} ${lastName}`;
  const { data, error } = await authClient.signUp.email({
    email,
    password,
    name
  })

  if (error) throw new Error("Failed to register", { cause: error })
  return data
}

if (!LanguageModel) {
  // Detect the feature and display "Not Supported" message as needed
  return;
}
// Define default values for topK and temperature within the application
const DEFAULT_TOP_K = 3;
const DEFAULT_TEMPERATURE = 1;
let session = null;

async function createAISession({ initialPrompts, topK, temperature } = {}) {
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
  const prompt = `Format the data below into a formatted JSON object.${api_response}`;
  const result = await session.prompt(prompt, { responseConstraint: PromptResponseSchema, });
  try {
    const fixedJson = fixJSON(result);
    // display result
    return fixedJson
  } catch (error) {
    // display error
    throw new Error("Error getting response", { cause: error })
  }
}

export { generateFormattedData }