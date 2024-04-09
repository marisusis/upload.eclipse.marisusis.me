import { Storage } from "@google-cloud/storage";
import path from "path";
import ky from "ky";

const password = process.env.PASSWORD ? process.env.PASSWORD : "yoy";

export default function (fastify, opts, done) {
  const storage = new Storage({
    keyFilename: "gcloud.json",
  });

  storage.getBuckets().then((results) => {
    console.log("Buckets:");
    results[0].forEach((bucket) => {
      console.log(bucket.name);
    });
  });

  fastify.get("/", async function handler(request, reply) {
    return {
      version: "v1.0.0",
    };
  });

  const bucket = storage.bucket("upload.eclipse.marisusis.me");

  fastify.get("/upload", async function handler(request, reply) {
    if (request.query.key != password) {
      reply.statusCode = 401;
      return {
        error: "Unauthorized",
      };
    }

    if (request.query.file == null) {
      reply.statusCode = 400;
      return {
        error: "Bad Request",
      };
    }

    let subfolder = request.query.identifier ? request.query.identifier : "anonymous";

    const [url] = await bucket
      // .file(path.join("UPLOAD", subfolder, request.query.file))
      .file(path.join(subfolder, request.query.file))
      .getSignedUrl({
        action: "write",
        version: "v4",
        expires: Date.now() + 15 * 60 * 1000,
      });

    reply.statusCode = 200;
    return {
      message: "Upload endpoint",
      url: url,
    };
  });

  done();
}
