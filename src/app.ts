import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { SERVICES } from "./config/services.ts";
import { healthRouter } from "./routes/health.ts";

export const app = new Hono();

// ─── Middleware ───────────────────────────────────────────────────────────────

app.use("*", logger());
app.use(
  "*",
  cors({
    origin: ["https://xeon.quest", "http://192.168.1.49:3000"],
    allowMethods: ["GET"],
  })
);

// ─── Routes ───────────────────────────────────────────────────────────────────

app.route("/health", healthRouter);

// GET / — list registered services (no probing)
app.get("/", (c) => {
  return c.json({
    name: "xeon.quest health check API",
    version: "1.0.0",
    endpoints: {
      "GET /health":                  "Probe all services",
      "GET /health/:service":         "Probe one service by name",
      "GET /health/group/:group":     "Probe a group (media | arr | observability | apps)",
    },
    services: SERVICES.map((s) => ({
      name: s.name,
      group: s.group,
      ...(s.subdomain ? { subdomain: s.subdomain } : {}),
    })),
  });
});
