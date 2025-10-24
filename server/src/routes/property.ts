// src/routes/gigs.ts
import { Elysia, t } from "elysia";
import { authGuard, authWrapper } from "./auth.ts";
import { MastraService } from "../mastra/services/index.ts";

export const gigRoutes = new Elysia()
    .use(authGuard)
    .get("/gigs", () => {
        // `auth` is the object returned from the macro (user + session)
        return {
            message: "here is the list of gigs",
        };
    }, {
        auth: true
    })
    // you can keep adding more gig endpoints here and they’ll inherit the guard
    .post("/gigs", ({ body }) => {
        // body validation etc.
        return { body };
    }, {
        auth: true
    })
    .post("/api/capture", async ({ body }) => {
        console.log("Received page data:", body)

        // Save to DB or process further
        return { message: "Captured successfully", received: body }
    })
    .post("/api/analyze", async ({ body: { title, url, content } }) => {
        // Pretend you do NLP, summarization, or categorization here
        // analyzing content 
        console.log({ title, url, content })
        const mastraService = new MastraService();
        const analysis = await mastraService.analyzeProperty(title, url, content);
        return (analysis)
    }, {
        body: t.Object({
            title: t.String(),
            url: t.String(),
            content: t.String()
        })
    })
