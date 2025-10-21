import { drizzle } from "drizzle-orm/bun-sql";
import { config } from "../config.ts";
import { SQL } from "bun";
import { schema } from "./schema.ts";


export const client = new SQL(config.DATABASE_URL,);

export const db = drizzle({
	client,
	casing: "snake_case",
});



export const clearDb = async () => {
	for (const table of Object.values(schema)) {
		await db.delete(table)
	}
}