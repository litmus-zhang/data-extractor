import { Elysia } from "elysia";
import { auth } from "../auth.ts";

// user middleware (compute user and session and pass to routes)
export const authWrapper = new Elysia({ name: "better_auth" })
	.mount(auth.handler)
	.macro({
		auth: {
			async resolve({ status, request: { headers } }) {
				const session = await auth.api.getSession({
					headers,
				});

				if (!session) return status(401);

				return {
					user: session.user,
					session: session.session,
				};
			},
		},
	})