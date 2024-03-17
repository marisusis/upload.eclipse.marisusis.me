// Import the framework and instantiate it
import Fastify from "fastify";
import path from "path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import fastifyStatic from "@fastify/static";
import cors from "@fastify/cors";
import apiHandler from "./routes/api.js";
import { Storage } from "@google-cloud/storage";
import process from "node:process";

const fastify = Fastify({
  logger: true,
});

const storage = new Storage({
  keyFilename: "gcloud.json",
});

let result = await storage
  .bucket("test.eclipse.marisusis.me")
  .setCorsConfiguration([
    {
      maxAgeSeconds: 3600,
      method: ["GET", "HEAD", "PUT", "POST", "DELETE"],
      origin: ["*"],
      responseHeader: ["*"],
    },
  ]);

fastify.register(fastifyStatic, {
  root: path.join(dirname(fileURLToPath(import.meta.url)), "app/build"),
  prefix: "/", // optional: default '/'
  // constraints: { host: "example.com" }, // optional: default {}
});

fastify.get("/", async function handler(request, reply) {
  return reply.sendFile("index.html"); // serving path.join(__dirname, 'public', 'myHtml.html') directly
});

await fastify.register(apiHandler, { prefix: "/api" });

await fastify.register(cors, {
  // put your options here
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received");
  // then manually exit
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT received");
  // then manually exit
  process.exit(0);
});

// Run the server!
try {
  await fastify.listen({ port: 8080, host: "::" });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
