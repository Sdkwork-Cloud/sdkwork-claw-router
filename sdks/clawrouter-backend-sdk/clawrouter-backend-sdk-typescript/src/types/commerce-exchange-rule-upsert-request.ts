import type { JsonValue } from './json-value';

/** Commerce exchange rule upsert request schema exposed by Claw Router. */
export interface CommerceExchangeRuleUpsertRequest {
  /** Rate field on commerce exchange rule upsert request. */
  rate: string;
  /** Source asset type field on commerce exchange rule upsert request. */
  sourceAssetType: string;
  /** Status field on commerce exchange rule upsert request. */
  status?: 'active' | 'inactive';
  /** Target asset type field on commerce exchange rule upsert request. */
  targetAssetType: string;
}
