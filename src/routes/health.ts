import { Hono } from "hono";
import { SERVICES } from "../config/services.ts";
import { probeAll, probeService, summarise } from "../lib/probe.ts";

export const healthRouter = new Hono();

// GET /health — probe all services in parallel
healthRouter.get("/", async (c) => {
  const results = await probeAll(SERVICES);
  const { overall, summary } = summarise(results);

  return c.json({
    overall,
    summary,
    checked_at: new Date().toISOString(),
    services: results,
  });
});

// GET /health/group/:group — probe all services in a group
healthRouter.get("/group/:group", async (c) => {
  const group = c.req.param("group").toLowerCase();
  const matches = SERVICES.filter((s) => s.group === group);

  if (!matches.length) {
    return c.json({ error: `Group '${group}' not found` }, 404);
  }

  const results = await probeAll(matches);
  const { overall, summary } = summarise(results);

  return c.json({ group, overall, summary, services: results });
});

// GET /health/:service — probe a single service by name (case-insensitive)
// Note: must be defined after /group/:group to avoid route conflict
healthRouter.get("/:service", async (c) => {
  const name = c.req.param("service").toLowerCase();
  const svc = SERVICES.find((s) => s.name.toLowerCase() === name);

  if (!svc) {
    return c.json({ error: `Service '${name}' not found` }, 404);
  }

  return c.json(await probeService(svc));
});
