import { createGoogleGenerativeAI } from "@ai-sdk/google";
import env from "env-var";

export const config = {
	NODE_ENV: env
		.get("NODE_ENV")
		.default("development")
		.asEnum(["production", "test", "development"]),

	PORT: env.get("PORT").default(3000).asPortNumber(),
	API_URL: env
		.get("API_URL")
		.default(`https://${env.get("PUBLIC_DOMAIN").asString()}`)
		.asString(),
	DATABASE_URL: env.get("DATABASE_URL").required().asString(),
	REDIS_HOST: env.get("REDIS_HOST").default("localhost").asString(),
	POSTHOG_API_KEY: env
		.get("POSTHOG_API_KEY")
		.default("it's a secret")
		.asString(),
	POSTHOG_HOST: env.get("POSTHOG_HOST").default("localhost").asString(),
	GOOGLE_GENERATIVE_AI_API_KEY: env
		.get("GOOGLE_GENERATIVE_AI_API_KEY")
		.required()
		.asString(),
	LOCK_STORE: env
		.get("LOCK_STORE")
		.default("memory")
		.asEnum(["memory", "redis"]),
	AUTH_CORS: env.get("AUTH_CORS").default("http://localhost:3001").asString().split(","),
	KLAVIS_API_KEY: env.get("KLAVIS_API_KEY").required().asString(),
};

export const google = createGoogleGenerativeAI({
	apiKey: config.GOOGLE_GENERATIVE_AI_API_KEY,
});