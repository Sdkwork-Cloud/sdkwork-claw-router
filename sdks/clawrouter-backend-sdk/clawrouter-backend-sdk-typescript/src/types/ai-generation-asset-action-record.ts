import type { JsonValue } from './json-value';

/** Ai generation asset action record schema exposed by Claw Router. */
export interface AiGenerationAssetActionRecord {
  /** Action params field on ai generation asset action record. */
  action_params?: Record<string, JsonValue>;
  /** Action type field on ai generation asset action record. */
  action_type?: string;
  /** Asset id field on ai generation asset action record. */
  asset_id?: string;
  /** Client ip hash field on ai generation asset action record. */
  client_ip_hash?: string;
  /** Client ip region field on ai generation asset action record. */
  client_ip_region?: string;
  /** Completed at field on ai generation asset action record. */
  completed_at?: string;
  /** Created at field on ai generation asset action record. */
  created_at?: string;
  /** Failure code field on ai generation asset action record. */
  failure_code?: string;
  /** Id field on ai generation asset action record. */
  id?: string;
  /** Job id field on ai generation asset action record. */
  job_id?: string;
  /** Legal hold field on ai generation asset action record. */
  legal_hold?: boolean;
  /** Metadata field on ai generation asset action record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on ai generation asset action record. */
  organization_id?: string;
  /** Payload hash field on ai generation asset action record. */
  payload_hash?: string;
  /** Request id field on ai generation asset action record. */
  request_id?: string;
  /** Result asset id field on ai generation asset action record. */
  result_asset_id?: string;
  /** Retention until field on ai generation asset action record. */
  retention_until?: string;
  /** Status field on ai generation asset action record. */
  status?: string;
  /** Tenant id field on ai generation asset action record. */
  tenant_id?: string;
  /** Trace id field on ai generation asset action record. */
  trace_id?: string;
  /** User agent hash field on ai generation asset action record. */
  user_agent_hash?: string;
  /** User id field on ai generation asset action record. */
  user_id?: string;
  /** Uuid field on ai generation asset action record. */
  uuid?: string;
}
