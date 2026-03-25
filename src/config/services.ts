import type { ServiceDef } from "../types.ts";

// ─────────────────────────────────────────────────────────────────────────────
// Service definitions
//
// To add a service:    add an entry to the relevant group array below.
// To disable a service: set `enabled: false` (keeps it in config but skips probing).
// To remove a service: delete the entry.
//
// Fields:
//   name        Display name
//   group       One of: media | arr | observability | apps
//   subdomain   Public URL (optional, informational only)
//   healthUrl   Internal endpoint to probe
//   healthCheck fn(body, status) => boolean — return true if healthy
//               Omit to use the default: status < 400
//   timeoutMs   Probe timeout (default: 4000ms)
//   enabled     Set false to skip without removing (default: true)
// ─────────────────────────────────────────────────────────────────────────────

const media: ServiceDef[] = [
  {
    name: "Plex",
    group: "media",
    healthUrl: "http://192.168.1.49:32400/identity",
    healthCheck: (_, status) => status === 200,
  },
  {
    name: "Tautulli",
    group: "media",
    subdomain: "https://tautulli.xeon.quest",
    healthUrl: "http://192.168.1.49:8181/status",
    healthCheck: (_, status) => status === 200,
  },
  {
    name: "Overseerr",
    group: "media",
    subdomain: "https://overseerr.xeon.quest",
    healthUrl: "http://192.168.1.49:5055/api/v1/status",
    healthCheck: (body, status) => {
      if (status !== 200) return false;
      const b = body as Record<string, unknown>;
      return b?.status === "ok" || typeof b?.version === "string";
    },
  },
  {
    name: "Immich",
    group: "media",
    subdomain: "https://photos.xeon.quest",
    healthUrl: "http://192.168.1.49:2283/api/server/ping",
    healthCheck: (body, status) => {
      if (status !== 200) return false;
      const b = body as Record<string, unknown>;
      return b?.res === "pong";
    },
  },
];

const arr: ServiceDef[] = [
  {
    name: "Sonarr",
    group: "arr",
    healthUrl: "http://192.168.1.49:8989/api/v3/system/status",
    headers: () => ({ "X-Api-Key": process.env.SONARR_API_KEY ?? "" }),
    healthCheck: (body, status) => {
      if (status !== 200) return false;
      const b = body as Record<string, unknown>;
      return typeof b?.version === "string";
    },
  },
  {
    name: "Radarr",
    group: "arr",
    healthUrl: "http://192.168.1.49:7878/api/v3/system/status",
    headers: () => ({ "X-Api-Key": process.env.RADARR_API_KEY ?? "" }),
    healthCheck: (body, status) => {
      if (status !== 200) return false;
      const b = body as Record<string, unknown>;
      return typeof b?.version === "string";
    },
  },
  {
    name: "Prowlarr",
    group: "arr",
    healthUrl: "http://192.168.1.49:9696/api/v1/system/status",
    headers: () => ({ "X-Api-Key": process.env.PROWLARR_API_KEY ?? "" }),
    healthCheck: (body, status) => {
      if (status !== 200) return false;
      const b = body as Record<string, unknown>;
      return typeof b?.version === "string";
    },
  },
  {
    name: "Lidarr",
    group: "arr",
    healthUrl: "http://192.168.1.49:8686/api/v1/system/status",
    headers: () => ({ "X-Api-Key": process.env.LIDARR_API_KEY ?? "" }),
    healthCheck: (body, status) => {
      if (status !== 200) return false;
      const b = body as Record<string, unknown>;
      return typeof b?.version === "string";
    },
  },
  {
    name: "Bazarr",
    group: "arr",
    healthUrl: "http://192.168.1.49:6767/api/system/status",
    headers: () => ({ "X-Api-Key": process.env.BAZARR_API_KEY ?? "" }),
    healthCheck: (_, status) => status === 200,
  },
  {
    name: "Bookshelf",
    group: "arr",
    healthUrl: "http://192.168.1.49:8787/api/v1/system/status",
    headers: () => ({ "X-Api-Key": process.env.BOOKSHELF_API_KEY ?? "" }),
    healthCheck: (body, status) => {
      if (status !== 200) return false;
      const b = body as Record<string, unknown>;
      return typeof b?.version === "string";
    },
  },
];

const observability: ServiceDef[] = [
  {
    name: "Grafana",
    group: "observability",
    subdomain: "https://grafana.xeon.quest",
    healthUrl: "http://192.168.1.49:3001/api/health",
    healthCheck: (body, status) => {
      if (status !== 200) return false;
      const b = body as Record<string, unknown>;
      return b?.database === "ok";
    },
  },
  {
    name: "Prometheus",
    group: "observability",
    healthUrl: "http://192.168.1.49:9090/-/healthy",
    healthCheck: (_, status) => status === 200,
  },
  {
    name: "Loki",
    group: "observability",
    healthUrl: "http://192.168.1.49:3100/ready",
    healthCheck: (_, status) => status === 200,
  },
];

const apps: ServiceDef[] = [
  {
    name: "Firefly III",
    group: "apps",
    subdomain: "https://firefly.xeon.quest",
    healthUrl: "http://192.168.1.49:8282/health",
    healthCheck: (_, status) => status === 200,
  },
  {
    name: "Foundry VTT",
    group: "apps",
    subdomain: "https://foundry.xeon.quest",
    healthUrl: "http://192.168.1.49:30000/api/status",
    healthCheck: (_, status) => status === 200 || status === 302,
  },
  {
    name: "NPM",
    group: "apps",
    healthUrl: "http://192.168.1.49:81/api",
    healthCheck: (_, status) => status < 500,
  },
  {
    name: "Nextcloud",
    group: "apps",
    subdomain: "https://cloud.xeon.quest",
    healthUrl: "https://cloud.xeon.quest/status.php",
    healthCheck: (body, status) => {
      if (status !== 200) return false;
      const b = body as Record<string, unknown>;
      return b?.installed === true && b?.maintenance === false;
    },
  },
  {
    name: "Calibre-Web",
    group: "apps",
    subdomain: "https://books.xeon.quest",
    healthUrl: "http://192.168.1.49:8082",
    healthCheck: (_, status) => status === 200 || status === 302,
  },
  {
    name: "Calibre",
    group: "apps",
    healthUrl: "http://192.168.1.49:8083",
    healthCheck: (_, status) => status === 200 || status === 302 || status === 401,
  },
];

// All enabled services exported as a flat array
export const SERVICES: ServiceDef[] = [
  ...media,
  ...arr,
  ...observability,
  ...apps,
].filter((s) => s.enabled !== false);