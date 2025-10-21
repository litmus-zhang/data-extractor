// src/routes/gigs.ts
import { Elysia } from "elysia";
import { authGuard, authWrapper } from "./auth.ts";

export const userRoutes = new Elysia()
    .use(authWrapper)
    .get("/user", () => {
        // `auth` is the object returned from the macro (user + session)
        return {
            message: "here is the list of gigs",
        };
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