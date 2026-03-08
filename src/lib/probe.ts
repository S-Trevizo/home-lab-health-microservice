import type { ServiceDef, HealthResult, HealthStatus } from "../types.ts";

const DEFAULT_TIMEOUT_MS = 4000;

export async function probeService(svc: ServiceDef): Promise<HealthResult> {
  const start = Date.now();
  const timeout = svc.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const checked_at = new Date().toISOString();

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    const headers = typeof svc.headers === "function" ? svc.headers() : svc.headers;
    
    const res = await fetch(svc.healthUrl, {
      signal: controller.signal,
      headers: { Accept: "application/json, text/plain, */*", ...headers },
    });

    clearTimeout(timer);

    const latency_ms = Date.now() - start;
    const body = await parseBody(res);
    const healthy = svc.healthCheck
      ? svc.healthCheck(body, res.status)
      : res.status < 400;

    return {
      name: svc.name,
      group: svc.group,
      status: healthy ? "up" : "degraded",
      subdomain: svc.subdomain,
      latency_ms,
      http_status: res.status,
      checked_at,
    };
  } catch (err: unknown) {
    const latency_ms = Date.now() - start;
    const isTimeout = err instanceof Error && err.name === "AbortError";

    return {
      name: svc.name,
      group: svc.group,
      status: "down",
      subdomain: svc.subdomain,
      latency_ms: isTimeout ? null : latency_ms,
      http_status: null,
      checked_at,
      error: isTimeout ? "timeout" : String(err),
    };
  }
}

export async function probeAll(services: ServiceDef[]): Promise<HealthResult[]> {
  return Promise.all(services.map(probeService));
}

export function summarise(results: HealthResult[]) {
  const up = results.filter((r) => r.status === "up").length;
  const degraded = results.filter((r) => r.status === "degraded").length;
  const down = results.filter((r) => r.status === "down").length;

  const overall: HealthStatus =
    down > 0 || degraded > 0 ? "degraded" : "up";

  return {
    overall,
    summary: { total: results.length, up, degraded, down },
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function parseBody(res: Response): Promise<unknown> {
  const ct = res.headers.get("content-type") ?? "";
  try {
    return ct.includes("application/json") ? await res.json() : await res.text();
  } catch {
    return null;
  }
}
