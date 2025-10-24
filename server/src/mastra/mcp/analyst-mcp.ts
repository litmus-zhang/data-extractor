import { MCPClient } from "@mastra/mcp";
 
export const testMcpClient = new MCPClient({
  id: "prop-analyst-mcp-client",
  servers: {
    wikipedia: {
      command: "npx",
      args: ["-y", "wikipedia-mcp"]
    },
    // weather: {
    //   url: new URL(`https://server.smithery.ai/@smithery-ai/national-weather-service/mcp?api_key=${process.env.SMITHERY_API_KEY}`)
    // },
  }
});