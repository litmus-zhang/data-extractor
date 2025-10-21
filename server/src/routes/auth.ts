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

export const authGuard = new Elysia()
	// .guard({
	// 	beforeHandle: [
	// 		({ status, headers: { Authorization } }) => {
	// 			if (!Authorization) return status(401)
	// 		},
	// 		({ query: { name } }) => {
	// 			console.log(name)
	// 		}
	// 	],
	// 	afterResponse({ responseValue }) {
	// 		console.log(responseValue)
	// 	}
	// })
	.as("global")
	.onBeforeHandle(async ({ request, set, status, headers }) => {
		// 1️⃣  Pick the token – you can adapt this to cookies, query‑param, etc.
		const authHeader = request.headers.get("authorization");
		if (!authHeader?.startsWith("Bearer ")) {
			// `error` creates an Elysia HTTPError that will be turned into a 401 response
			return status(401, "Missing or malformed Authorization header");

		}
		// const token = authHeader.slice(7); // strip “Bearer ”
		// 2️⃣  Verify the token (you already have a function for that)
		const payload = await auth.api.getSession({
			headers: {
				authorization: authHeader
			}
		});   // ← returns `{ id, role, … }` or throws
		// 3️⃣  Attach the payload to the request context so route handlers can use it
		//     (`decorate` on the request works because the request object is mutable)
		(request as any).user = payload;          // <- `any` is fine here; later we’ll type it
		return payload;
	});