import { Mastra } from "@mastra/core";
import { mastra } from "../index.ts";
import { stripFirstFence } from "../../utils.ts";
import { jsonrepair } from 'jsonrepair'


export class MastraService {
    private ai: Mastra
    constructor() {
        this.ai = mastra
    }

    async analyzeProperty(title: string, url: string, content: string) {
        // Pretend you do NLP, summarization, or categorization here
        const agent = this.ai.getAgent("propertyAnalyst");

        try {
            const result = await agent.generate(`Analyze the property:${title} ,${url} , with the details: ${content}`);
            return jsonrepair(result.text)
        } catch (error) {
            console.error("Agent error:", error);
            throw new Error("An error occurred while processing your request", { cause: error });
        }
    }
    async addToCRM(title: string, url: string, content: string) {
        const agent = this.ai.getAgent("klavis_agent");
        try {
            const result = await agent.generate(`Add the property details to Pipedrive:${title} ,${url} , with the details: ${content}`);
            return result.text;
        } catch (error) {
            console.error("Agent error:", error);
            throw new Error("An error occurred while processing your request");
        }


    }
    async addToAirtable(title: string, url: string, content: string) {
        const agent = this.ai.getAgent("klavis_agent");
        try {
            const result = await agent.generate(`Add the property to the Airtable:${title} ,${url} , with the details: ${content}`);
            return result.text;
        } catch (error) {
            console.error("Agent error:", error);
            throw new Error("An error occurred while processing your request");
        }


    }

}