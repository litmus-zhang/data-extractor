import { Mastra } from "@mastra/core";
import { mastra } from "../index.ts";

export class MastraService {
    private ai: Mastra
    constructor() {
        this.ai = mastra
    }
    async unwrapAllFences(text: string) {
        return text.replace(/```(?:\w+)?\n([\s\S]*?)\n```/g, (_, inner) => inner);
    }

    async stripFirstFence(text: string) {
        const m = text.match(/```(?:\w+)?\n([\s\S]*?)\n```/);
        return m ? m[1] : text;
    }
    async analyzeProperty(title: string, url: string, content: string) {
        // Pretend you do NLP, summarization, or categorization here
        const agent = this.ai.getAgent("propertyAnalyst");

        try {
            const result = await agent.generate(`Analyze the property:${title} ,${url} , with the details: ${content}`);
            return this.stripFirstFence(result.text)
            //  return JSON.parse(stripped!)
        } catch (error) {
            console.error("Agent error:", error);
            throw new Error("An error occurred while processing your request");
        }
    }
    async addToCRM(title: string, url: string, content: string) {
        const agent = this.ai.getAgent("klavis_agent");
        try {
            const result = await agent.generate(`Add the property to the Pipedrive:${title} ,${url} , with the details: ${content}`);
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