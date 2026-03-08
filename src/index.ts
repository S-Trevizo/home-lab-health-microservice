import { createServer } from "node:http";
import { serve } from "@hono/node-server";
import { app } from "./app.ts";

const PORT = Number(process.env.PORT ?? 4000);

console.log("SONARR_API_KEY at startup:", process.env.SONARR_API_KEY);
console.log("RADARR_API_KEY at startup:", process.env.RADARR_API_KEY);
console.log("PROWLARR_API_KEY at startup:", process.env.PROWLARR_API_KEY);
console.log("LIDARR_API_KEY at startup:", process.env.LIDARR_API_KEY);
console.log("BAZARR_API_KEY at startup:", process.env.BAZARR_API_KEY);

serve({ fetch: app.fetch, port: PORT, createServer }, () => {
  console.log(`[healthcheck-api] Listening on http://localhost:${PORT}`);
});
