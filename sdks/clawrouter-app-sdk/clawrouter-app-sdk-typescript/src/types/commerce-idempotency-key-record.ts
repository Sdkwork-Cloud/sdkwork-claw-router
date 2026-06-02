/** Commerce idempotency key record schema exposed by Claw Router. */
export interface CommerceIdempotencyKeyRecord {
  /** Created at field on commerce idempotency key record. */
  created_at: string;
  /** Expires at field on commerce idempotency key record. */
  expires_at: string;
  /** Id field on commerce idempotency key record. */
  id?: string;
  /** Idempotency key field on commerce idempotency key record. */
  idempotency_key: string;
  /** Locked until field on commerce idempotency key record. */
  locked_until?: string;
  /** Organization id field on commerce idempotency key record. */
  organization_id?: string;
  /** Request hash field on commerce idempotency key record. */
  request_hash: string;
  /** Response json field on commerce idempotency key record. */
  response_json?: string;
  /** Scope field on commerce idempotency key record. */
  scope: string;
  /** Status field on commerce idempotency key record. */
  status: string;
  /** Tenant id field on commerce idempotency key record. */
  tenant_id: string;
  /** Updated at field on commerce idempotency key record. */
  updated_at: string;
}
