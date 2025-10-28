import { Agent } from '@mastra/core/agent';
import { MCPClient } from '@mastra/mcp';
import { KlavisClient, Klavis } from 'klavis';
import open from 'open';
import { config, google } from '../../config.ts';

// Creates an MCP Agent with tools from Klavis Strata server
export const createMcpAgent = async (userId: string = 'test-user'): Promise<Agent> => {
  const klavis = new KlavisClient({ apiKey: config.KLAVIS_API_KEY! });

  // Create a Strata MCP Server with Gmail and Slack
  const response = await klavis.mcpServer.createStrataServer({
    servers: [Klavis.McpServerName.Airtable, Klavis.McpServerName.Pipedrive],
    userId
  });

  // Handle OAuth authorization for each service
  if (response.oauthUrls) {
    for (const [serverName, oauthUrl] of Object.entries(response.oauthUrls)) {
      await open(oauthUrl);
      console.log(`Please complete ${serverName} OAuth authorization at: ${oauthUrl}`);
    }
  }

  // Initialize the MCP client with Strata server URL
  const mcpClient = new MCPClient({
    servers: {
      strata: {
        url: new URL(response.strataServerUrl)
      }
    }
  });

  // Create agent
  return new Agent({
    name: 'Klavis MCP Agent',
    instructions: `You are an AI agent with access to MCP tools.
    `,
    model: google('gemini-2.5-pro'),
    tools: await mcpClient.getTools()
  });
};

export const klavis_agent = await createMcpAgent();
