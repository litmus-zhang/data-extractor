import { email } from "better-auth/*";
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    baseURL: "http://localhost:4000/auth" /* Base URL of your Better Auth backend. */,
    plugins: [],
});