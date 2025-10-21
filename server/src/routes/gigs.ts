// src/routes/gigs.ts
import { Elysia } from "elysia";
import { authGuard, authWrapper } from "./auth.ts";

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
