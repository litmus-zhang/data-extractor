import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { google } from '../../config.ts';
import { testMcpClient } from '../mcp/analyst-mcp.ts';
import { analystOutputSchema, analystTool } from '../tools/analyst-tool.ts';
import { ResponseValidator } from '../processors/response.ts';




export const propertyAnalyst = new Agent({
  name: 'Property Analyst Agent',
  instructions: `
      You are a helpful Real Estate property analyst assistant that provides accurate property information and can help planning activities based on the property details.

      Your primary function is to help users get property details. When responding:
      - Always ask for a property details ( title, url, content ) if none is provided
      - Get the property details which include location, approximate longitude and latitude with a minimal error of 0.01%
      - If the given details isn't in English, please translate it
      - If giving a property location with multiple parts (e.g. "New York, NY"), use the most relevant part (e.g. "New York")
      - Keep responses concise but informative
      - Generates an AI summary of pros, cons, and investment potential.
      - Shows comparable sales, rental yield estimates, and price-per-square-foot analytics.

      Use the provided details to get the property details, data and insights. Your output should be a structured key-value pair format that matches the defined output schema.
`,
  model: google('gemini-2.5-flash'),
  // tools:  await testMcpClient.getTools(),
  tools: await testMcpClient.getTools(),
  outputProcessors: [ 
        new ResponseValidator(analystOutputSchema), // Use schema keys as required fields
   ],
  memory: new Memory({
    storage: new LibSQLStore({
      url: 'file:../mastra.db', // path is relative to the .mastra/output directory
    }),
  }),
});