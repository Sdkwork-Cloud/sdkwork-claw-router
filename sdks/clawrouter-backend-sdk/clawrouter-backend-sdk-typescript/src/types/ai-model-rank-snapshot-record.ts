import type { JsonValue } from './json-value';

/** Ai model rank snapshot record schema exposed by Claw Router. */
export interface AiModelRankSnapshotRecord {
  /** Base volume field on ai model rank snapshot record. */
  base_volume?: string;
  /** Catalog key field on ai model rank snapshot record. */
  catalog_key: string;
  /** Color token field on ai model rank snapshot record. */
  color_token?: string;
  /** Context size text field on ai model rank snapshot record. */
  context_size_text?: string;
  /** Cost amount field on ai model rank snapshot record. */
  cost_amount?: string;
  /** Cost indicator field on ai model rank snapshot record. */
  cost_indicator?: number;
  /** Created at field on ai model rank snapshot record. */
  created_at?: string;
  /** Currency field on ai model rank snapshot record. */
  currency?: string;
  /** Id field on ai model rank snapshot record. */
  id?: string;
  /** Is new field on ai model rank snapshot record. */
  is_new?: boolean;
  /** Latency p 50 ms field on ai model rank snapshot record. */
  latency_p50_ms?: number;
  /** Latency p 95 ms field on ai model rank snapshot record. */
  latency_p95_ms?: number;
  /** License type field on ai model rank snapshot record. */
  license_type?: string;
  /** Metadata field on ai model rank snapshot record. */
  metadata?: Record<string, JsonValue>;
  /** Modality field on ai model rank snapshot record. */
  modality?: string;
  /** Model field on ai model rank snapshot record. */
  model: string;
  /** Model id field on ai model rank snapshot record. */
  model_id?: string;
  /** Organization id field on ai model rank snapshot record. */
  organization_id: string;
  /** Previous rank no field on ai model rank snapshot record. */
  previous_rank_no?: number;
  /** Pricing text field on ai model rank snapshot record. */
  pricing_text?: string;
  /** Provider code field on ai model rank snapshot record. */
  provider_code?: string;
  /** Rank no field on ai model rank snapshot record. */
  rank_no: number;
  /** Rank payload field on ai model rank snapshot record. */
  rank_payload?: Record<string, JsonValue>;
  /** Rank scope field on ai model rank snapshot record. */
  rank_scope: string;
  /** Rebuild version field on ai model rank snapshot record. */
  rebuild_version?: string;
  /** Region code field on ai model rank snapshot record. */
  region_code: string;
  /** Request count field on ai model rank snapshot record. */
  request_count?: string;
  /** Snapshot date field on ai model rank snapshot record. */
  snapshot_date: string;
  /** Snapshot period field on ai model rank snapshot record. */
  snapshot_period: string;
  /** Source id field on ai model rank snapshot record. */
  source_id?: string;
  /** Source type field on ai model rank snapshot record. */
  source_type?: string;
  /** Source version field on ai model rank snapshot record. */
  source_version?: string;
  /** Status field on ai model rank snapshot record. */
  status: string;
  /** Strengths field on ai model rank snapshot record. */
  strengths?: Record<string, JsonValue>;
  /** Success rate field on ai model rank snapshot record. */
  success_rate?: string;
  /** Tenant id field on ai model rank snapshot record. */
  tenant_id: string;
  /** Token count field on ai model rank snapshot record. */
  token_count?: string;
  /** Trend score field on ai model rank snapshot record. */
  trend_score?: string;
  /** Updated at field on ai model rank snapshot record. */
  updated_at?: string;
  /** Uuid field on ai model rank snapshot record. */
  uuid: string;
  /** Vendor code field on ai model rank snapshot record. */
  vendor_code: string;
  /** Vendor name snapshot field on ai model rank snapshot record. */
  vendor_name_snapshot?: string;
  /** Win rate field on ai model rank snapshot record. */
  win_rate?: string;
}
