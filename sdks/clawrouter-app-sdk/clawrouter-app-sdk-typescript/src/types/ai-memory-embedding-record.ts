import type { JsonValue } from './json-value';

/** Ai memory embedding record schema exposed by Claw Router. */
export interface AiMemoryEmbeddingRecord {
  /** Content hash field on ai memory embedding record. */
  content_hash?: string;
  /** Created at field on ai memory embedding record. */
  created_at?: string;
  /** Data scope field on ai memory embedding record. */
  data_scope?: string;
  /** Deleted at field on ai memory embedding record. */
  deleted_at?: string;
  /** Deleted by field on ai memory embedding record. */
  deleted_by?: string;
  /** Embedding dimensions field on ai memory embedding record. */
  embedding_dimensions?: number;
  /** Embedding model field on ai memory embedding record. */
  embedding_model?: string;
  /** Embedding provider field on ai memory embedding record. */
  embedding_provider?: string;
  /** Id field on ai memory embedding record. */
  id?: string;
  /** Indexed at field on ai memory embedding record. */
  indexed_at?: string;
  /** Memory id field on ai memory embedding record. */
  memory_id?: string;
  /** Metadata field on ai memory embedding record. */
  metadata?: Record<string, JsonValue>;
  /** Organization id field on ai memory embedding record. */
  organization_id?: string;
  /** Status field on ai memory embedding record. */
  status?: string;
  /** Tenant id field on ai memory embedding record. */
  tenant_id?: string;
  /** Updated at field on ai memory embedding record. */
  updated_at?: string;
  /** Uuid field on ai memory embedding record. */
  uuid?: string;
  /** Vector json field on ai memory embedding record. */
  vector_json?: Record<string, JsonValue>;
  /** Vector storage key field on ai memory embedding record. */
  vector_storage_key?: string;
  /** Version field on ai memory embedding record. */
  version?: string;
}
