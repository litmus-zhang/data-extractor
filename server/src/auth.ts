import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { bearer, openAPI } from "better-auth/plugins";
import { db } from "./db/index.ts";
import { schema } from "./db/schema.ts";
import { config } from "./config.ts";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg", // or "mysql", "sqlite"
		schema,
	}),
	basePath: "/",
	trustedOrigins: config.AUTH_CORS,
	emailAndPassword: {
		enabled: true,
	},
	plugins: [openAPI(), bearer()],
});

let _schema: ReturnType<typeof auth.api.generateOpenAPISchema>;
const getSchema = async () => auth.api.generateOpenAPISchema();

export const OpenAPI = {
	getPaths: (prefix = "/auth") =>
		getSchema().then(({ paths }) => {
			const reference: typeof paths = Object.create(null);

			for (const path of Object.keys(paths)) {
				const key = prefix + path;
				const original = paths[path]!;
				reference[key] = original;

				for (const method of Object.keys(original)) {
					const operation = (reference[key] as any)[method];

					operation.tags = ["Better Auth"];
				}
			}

			return reference;
		}) as Promise<any>,
	components: getSchema().then(({ components }) => components) as Promise<any>,
} as const;
