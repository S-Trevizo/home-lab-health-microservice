export type HealthStatus = "up" | "down" | "degraded";

export type ServiceGroup = "media" | "arr" | "observability" | "apps";

export interface ServiceDef {
  name: string;
  headers?: Record<string, string>;
  group: ServiceGroup;
  /** Public subdomain if one exists */
  subdomain?: string;
  /** Internal URL to probe */
  healthUrl: string;
  /** Return true if the response should be considered healthy */
  healthCheck?: (body: unknown, status: number) => boolean;
  /** Probe timeout in ms (default: 4000) */
  timeoutMs?: number;
  /** Whether this service is enabled (default: true) */
  enabled?: boolean;
}

export interface HealthResult {
  name: string;
  group: ServiceGroup;
  status: HealthStatus;
  subdomain?: string;
  latency_ms: number | null;
  http_status: number | null;
  checked_at: string;
  error?: string;
}

export interface HealthResponse {
  overall: HealthStatus;
  summary: {
    total: number;
    up: number;
    degraded: number;
    down: number;
  };
  checked_at: string;
  services: HealthResult[];
}
