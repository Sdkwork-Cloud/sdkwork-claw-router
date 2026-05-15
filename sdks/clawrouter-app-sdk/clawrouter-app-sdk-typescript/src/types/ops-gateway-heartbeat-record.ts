import type { JsonValue } from './json-value';

/** Ops gateway heartbeat record schema exposed by Claw Router. */
export interface OpsGatewayHeartbeatRecord {
  /** Active connections field on ops gateway heartbeat record. */
  active_connections?: string;
  /** Cpu percent field on ops gateway heartbeat record. */
  cpu_percent?: string;
  /** Created at field on ops gateway heartbeat record. */
  created_at?: string;
  /** Disk percent field on ops gateway heartbeat record. */
  disk_percent?: string;
  /** Heartbeat at field on ops gateway heartbeat record. */
  heartbeat_at?: string;
  /** Id field on ops gateway heartbeat record. */
  id?: string;
  /** Instance id field on ops gateway heartbeat record. */
  instance_id?: string;
  /** Legal hold field on ops gateway heartbeat record. */
  legal_hold?: boolean;
  /** Memory percent field on ops gateway heartbeat record. */
  memory_percent?: string;
  /** Metadata field on ops gateway heartbeat record. */
  metadata?: Record<string, JsonValue>;
  /** Network in bytes field on ops gateway heartbeat record. */
  network_in_bytes?: string;
  /** Network out bytes field on ops gateway heartbeat record. */
  network_out_bytes?: string;
  /** Open file count field on ops gateway heartbeat record. */
  open_file_count?: string;
  /** Organization id field on ops gateway heartbeat record. */
  organization_id?: string;
  /** Payload field on ops gateway heartbeat record. */
  payload?: Record<string, JsonValue>;
  /** Payload hash field on ops gateway heartbeat record. */
  payload_hash?: string;
  /** Request id field on ops gateway heartbeat record. */
  request_id?: string;
  /** Retention until field on ops gateway heartbeat record. */
  retention_until?: string;
  /** Status field on ops gateway heartbeat record. */
  status?: string;
  /** Tenant id field on ops gateway heartbeat record. */
  tenant_id?: string;
  /** Thread count field on ops gateway heartbeat record. */
  thread_count?: string;
  /** Trace id field on ops gateway heartbeat record. */
  trace_id?: string;
  /** Uptime seconds field on ops gateway heartbeat record. */
  uptime_seconds?: string;
  /** User id field on ops gateway heartbeat record. */
  user_id?: string;
  /** Uuid field on ops gateway heartbeat record. */
  uuid?: string;
}
