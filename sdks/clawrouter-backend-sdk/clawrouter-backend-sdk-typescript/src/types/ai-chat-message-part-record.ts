import type { JsonValue } from './json-value';

/** Ai chat message part record schema exposed by Claw Router. */
export interface AiChatMessagePartRecord {
  /** Asset id field on ai chat message part record. */
  asset_id?: string;
  /** Created at field on ai chat message part record. */
  created_at?: string;
  /** File name field on ai chat message part record. */
  file_name?: string;
  /** File size field on ai chat message part record. */
  file_size?: string;
  /** Id field on ai chat message part record. */
  id?: string;
  /** Item id field on ai chat message part record. */
  item_id?: string;
  /** Json content field on ai chat message part record. */
  json_content?: Record<string, JsonValue>;
  /** Legal hold field on ai chat message part record. */
  legal_hold?: boolean;
  /** Media resource id field on ai chat message part record. */
  media_resource_id?: string;
  /** Message id field on ai chat message part record. */
  message_id?: string;
  /** Metadata field on ai chat message part record. */
  metadata?: Record<string, JsonValue>;
  /** Mime type field on ai chat message part record. */
  mime_type?: string;
  /** Object blob id field on ai chat message part record. */
  object_blob_id?: string;
  /** Organization id field on ai chat message part record. */
  organization_id?: string;
  /** Part no field on ai chat message part record. */
  part_no?: number;
  /** Part type field on ai chat message part record. */
  part_type?: string;
  /** Payload hash field on ai chat message part record. */
  payload_hash?: string;
  /** Provider part id field on ai chat message part record. */
  provider_part_id?: string;
  /** Request id field on ai chat message part record. */
  request_id?: string;
  /** Resource snapshot field on ai chat message part record. */
  resource_snapshot?: Record<string, JsonValue>;
  /** Retention until field on ai chat message part record. */
  retention_until?: string;
  /** Sha 256 field on ai chat message part record. */
  sha256?: string;
  /** Status field on ai chat message part record. */
  status?: string;
  /** Tenant id field on ai chat message part record. */
  tenant_id?: string;
  /** Text content field on ai chat message part record. */
  text_content?: string;
  /** Trace id field on ai chat message part record. */
  trace_id?: string;
  /** User id field on ai chat message part record. */
  user_id?: string;
  /** Uuid field on ai chat message part record. */
  uuid?: string;
}
