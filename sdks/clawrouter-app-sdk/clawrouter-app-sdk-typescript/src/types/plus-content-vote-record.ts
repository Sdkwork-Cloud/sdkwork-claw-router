import type { JsonValue } from './json-value';

/** Plus content vote record schema exposed by Claw Router. */
export interface PlusContentVoteRecord {
  /** Client ip field on plus content vote record. */
  client_ip?: string;
  /** Content id field on plus content vote record. */
  content_id?: string;
  /** Content type field on plus content vote record. */
  content_type?: number;
  /** Created at field on plus content vote record. */
  created_at?: string;
  /** Data scope field on plus content vote record. */
  data_scope?: number;
  /** Device info field on plus content vote record. */
  device_info?: string;
  /** Id field on plus content vote record. */
  id?: string;
  /** Metadata field on plus content vote record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on plus content vote record. */
  organization_id?: string;
  /** Rating field on plus content vote record. */
  rating?: string;
  /** Source field on plus content vote record. */
  source?: string;
  /** Tenant id field on plus content vote record. */
  tenant_id?: string;
  /** Updated at field on plus content vote record. */
  updated_at?: string;
  /** User id field on plus content vote record. */
  user_id?: string;
  /** Uuid field on plus content vote record. */
  uuid?: string;
  /** V field on plus content vote record. */
  v?: string;
}
