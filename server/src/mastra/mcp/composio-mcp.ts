import { MCPClient } from "@mastra/mcp";

const mcp = new MCPClient({
  servers: {
    googleSheets: {
      url: new URL("https://mcp.composio.dev/googlesheets/[private-url-path]"),
    },
    gmail: {
      url: new URL("https://mcp.composio.dev/gmail/[private-url-path]"),
    },
    airtable:{
     url: new URL("")   
    }
  },
});