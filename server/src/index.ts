import { config } from "./config.ts";
import { client } from "./db/index.ts";
import { app } from "./server.ts";
import { posthog } from "./services/posthog.ts";

const signals = ["SIGINT", "SIGTERM"];

for (const signal of signals) {
	process.on(signal, async () => {
		console.log(`Received ${signal}. Initiating graceful shutdown...`);
		await app.stop();
		await posthog.shutdown();
		process.exit(0);
	});
}

process.on("uncaughtException", (error) => {
	console.error(error);
});

process.on("unhandledRejection", (error) => {
	console.error(error);
});

await client.connect();
console.log("🗄️ Database was connected!");

app.listen(config.PORT, () =>
	console.log(`🦊 Server started at ${app.server?.url.origin}`),
);


// import cluster from 'node:cluster'
// import os from 'node:os'
// import process from 'node:process'

// if (cluster.isPrimary) {
//   	for (let i = 0; i < os.availableParallelism(); i++)
//     	cluster.fork()
// } else {
//   	await import('./server')
//   	console.log(`Worker ${process.pid} started`)
// }