import error, { Elysia, } from "elysia";
import { auth } from "../auth.ts";
import { authenticatedRole } from "drizzle-orm/neon";

// user middleware (compute user and session and pass to routes)
export const authWrapper = new Elysia({ name: "better_auth" })
	.mount(auth.handler)
	.as('global')
	.macro({
		auth: {
			async resolve({ status, request: { headers } }) {
				const session = await auth.api.getSession({
					headers,
				});

				if (!session) return status(401, "Missing or malformed Authorization header");

				return {
					user: session.user,
					session: session.session,
				};
			},
		},
	})


export const authGuard = new Elysia({ name: "authGuard" })
  .macro({
    auth: {
      // You can use this in route definitions for strong typing
      async resolve({ request, set }) {
        // Verify the session from cookies or Authorization header
        const session = await auth.api.getSession({
          headers: request.headers,
        });

        if (!session) {
          set.status = 401;
          throw new Error("Unauthorized");
        }

        // Expose user and session to the route context
        return {
          user: session.user,
          session: session.session,
        };
      },
    },
  })
  .derive(async ({ request, set }) => {
    // Auto-inject user/session in the request lifecycle
    const session = await auth.api.getSession({ headers: request.headers });
    if (session) return { user: session.user, session: session.session };

    // Optionally, leave undefined if not logged in
    return { user: null, session: null };
  });