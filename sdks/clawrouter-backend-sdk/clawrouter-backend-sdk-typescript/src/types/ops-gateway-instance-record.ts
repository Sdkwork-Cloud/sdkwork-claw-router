import type { JsonValue } from './json-value';

/** Ops gateway instance record schema exposed by Claw Router. */
export interface OpsGatewayInstanceRecord {
  /** Cell field on ops gateway instance record. */
  cell?: string;
  /** Config hash field on ops gateway instance record. */
  config_hash?: string;
  /** Container id hash field on ops gateway instance record. */
  container_id_hash?: string;
  /** Created at field on ops gateway instance record. */
  created_at?: string;
  /** Data scope field on ops gateway instance record. */
  data_scope?: string;
  /** Deleted at field on ops gateway instance record. */
  deleted_at?: string;
  /** Deleted by field on ops gateway instance record. */
  deleted_by?: string;
  /** Deployment mode field on ops gateway instance record. */
  deployment_mode?: string;
  /** Desktop device hash field on ops gateway instance record. */
  desktop_device_hash?: string;
  /** Health status field on ops gateway instance record. */
  health_status?: string;
  /** Host name field on ops gateway instance record. */
  host_name?: string;
  /** Id field on ops gateway instance record. */
  id?: string;
  /** Instance code field on ops gateway instance record. */
  instance_code?: string;
  /** Ip address hash field on ops gateway instance record. */
  ip_address_hash?: string;
  /** Ip address masked field on ops gateway instance record. */
  ip_address_masked?: string;
  /** Last heartbeat at field on ops gateway instance record. */
  last_heartbeat_at?: string;
  /** Metadata field on ops gateway instance record. */
  metadata?: Record<string, JsonValue>;
  /** Node name field on ops gateway instance record. */
  node_name?: string;
  /** Orchestrator field on ops gateway instance record. */
  orchestrator?: string;
  /** Organization id field on ops gateway instance record. */
  organization_id?: string;
  /** Pod name field on ops gateway instance record. */
  pod_name?: string;
  /** Region field on ops gateway instance record. */
  region?: string;
  /** Runtime type field on ops gateway instance record. */
  runtime_type?: string;
  /** Started at field on ops gateway instance record. */
  started_at?: string;
  /** Status field on ops gateway instance record. */
  status?: string;
  /** Tenant id field on ops gateway instance record. */
  tenant_id?: string;
  /** Updated at field on ops gateway instance record. */
  updated_at?: string;
  /** Uuid field on ops gateway instance record. */
  uuid?: string;
  /** Version field on ops gateway instance record. */
  version?: string;
  /** Version name field on ops gateway instance record. */
  version_name?: string;
}
