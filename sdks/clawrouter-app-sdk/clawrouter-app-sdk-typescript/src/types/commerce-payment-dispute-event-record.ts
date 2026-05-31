import type { JsonValue } from './json-value';

/** Commerce payment dispute event record schema exposed by Claw Router. */
export interface CommercePaymentDisputeEventRecord {
  /** Actor id field on commerce payment dispute event record. */
  actor_id?: string;
  /** Actor type field on commerce payment dispute event record. */
  actor_type: string;
  /** Created at field on commerce payment dispute event record. */
  created_at: string;
  /** Dispute id field on commerce payment dispute event record. */
  dispute_id: string;
  /** Event no field on commerce payment dispute event record. */
  event_no: string;
  /** Event type field on commerce payment dispute event record. */
  event_type: string;
  /** From status field on commerce payment dispute event record. */
  from_status?: string;
  /** Organization id field on commerce payment dispute event record. */
  organization_id?: string;
  /** Payload json field on commerce payment dispute event record. */
  payload_json?: Record<string, JsonValue>;
  /** Tenant id field on commerce payment dispute event record. */
  tenant_id: string;
  /** To status field on commerce payment dispute event record. */
  to_status: string;
}
