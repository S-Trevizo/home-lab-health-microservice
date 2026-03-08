import { createServer } from "node:http";
import { serve } from "@hono/node-server";
import { app } from "./app.ts";

const PORT = Number(process.env.PORT ?? 4000);

serve({ fetch: app.fetch, port: PORT, createServer }, () => {
  console.log(`[healthcheck-api] Listening on http://localhost:${PORT}`);
});
