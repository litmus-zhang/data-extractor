import { cors } from "@elysiajs/cors";
import { fromTypes, openapi } from "@elysiajs/openapi";
import { serverTiming } from "@elysiajs/server-timing";
import { Elysia } from "elysia";
import { healthcheckPlugin } from "elysia-healthcheck";
import { auth, OpenAPI } from "./auth.ts";
import { authGuard, authWrapper } from "./routes/auth.ts";
import { opentelemetry } from "@elysiajs/opentelemetry";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";
import { Logestic } from "logestic";
import { gigRoutes } from "./routes/gigs.ts";
import { userRoutes } from "./routes/user.ts";
import { aiRoutes } from "./routes/ai.ts";
import { config } from "./config.ts";

export const app = new Elysia()
	.use(
		openapi({
			documentation: {
				components: await OpenAPI.components,
				paths: await OpenAPI.getPaths(),
				info: {
					title: "Data Extractor",
					version: "v1.0.0",
				},
			},
			references: fromTypes()
		}),
	)
	.use(
		cors({
			origin: ["http://localhost:3001", `chrome-extension://${config.EXTENSION_ID}`],
			methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
			credentials: true,
			allowedHeaders: ["Content-Type", "Authorization"],
		}),
	)
	.use(serverTiming())
	.use(opentelemetry({
		spanProcessors: [new BatchSpanProcessor(new OTLPTraceExporter())]
	}))
	.use(Logestic.preset('common'))
	.use(
		healthcheckPlugin({
			prefix: "/health",
		}),
	)
	.mount("/auth", auth.handler)
	.use(authGuard)
	.get("/me", ({ user, session, set }) => {
		if (!user) {
			set.status = 401;
			return { error: "Unauthorized" };
		}
		return { user, session };
	})
	.use(gigRoutes)
	.use(userRoutes)
	.use(aiRoutes)


export type App = typeof app;
