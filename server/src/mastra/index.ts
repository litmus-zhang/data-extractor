import { PinoLogger } from "@mastra/loggers";
import { weatherAgent } from "./agents/weather-agent.ts";
import { weatherWorkflow } from "./workflows/weather-workflow.ts";
import { Mastra } from "@mastra/core";
import { propertyAnalyst } from "./agents/analyst-agent.ts";
import { klavis_agent } from "./mcp/klavis-mcp.ts";
import { LibSQLStore } from "@mastra/libsql";
import { propaWorkflow } from "./workflows/propa-workflow.ts";

export const mastra = new Mastra({
    workflows: { weatherWorkflow , propaWorkflow},
    agents: { weatherAgent , propertyAnalyst, klavis_agent},
    storage: new LibSQLStore({
      // stores observability, scores, ... into memory storage, if it needs to persist, change to file:../mastra.db
      url: "file:../mastra.db",
    }),
    logger: new PinoLogger({
        name: 'Mastra',
        level: 'info',
    }),
    telemetry: {
        // Telemetry is deprecated and will be removed in the Nov 4th release
        enabled: false,
    },
    observability: {
        // Enables DefaultExporter and CloudExporter for AI tracing
        default: { enabled: true },
    },
});