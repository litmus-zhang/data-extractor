// src/routes/gigs.ts
import { Elysia } from "elysia";
import { authGuard, authWrapper } from "./auth.ts";
import { mastra } from "../mastra/index.ts";

export const aiRoutes = new Elysia({ prefix: "/ai" })
    .use(authGuard)
    .get("/weather", async ({ query: { city }, status }) => {
        // `auth` is the object returned from the macro (user + session)
        if (!city) {
            return status(400, "Missing 'city' query parameter");
        }

        const agent = mastra.getAgent("weatherAgent");

        try {
            const result = await agent.generate(`What's the weather like in ${city}?`);
            return status(200, result.text);
        } catch (error) {
            console.error("Agent error:", error);
            return status(500, "An error occurred while processing your request");
        }
    }, {
        auth: true
    })
    // you can keep adding more gig endpoints here and they’ll inherit the guard
    .post("/user", ({ body }) => {
        // body validation etc.
        return { body };
    }, {
        auth: true
    })