import type { JsonValue } from './json-value';
import type { MediaResource } from './media-resource';

/** Plus agent skill record schema exposed by Claw Router. */
export interface PlusAgentSkillRecord {
  /** Builtin field on plus agent skill record. */
  builtin?: boolean;
  /** Capabilities field on plus agent skill record. */
  capabilities?: Record<string, JsonValue>;
  /** Category id field on plus agent skill record. */
  category_id?: string;
  /** Config schema field on plus agent skill record. */
  config_schema?: Record<string, JsonValue>;
  /** Cover field on plus agent skill record. */
  cover?: MediaResource;
  /** Created at field on plus agent skill record. */
  created_at?: string;
  /** Currency field on plus agent skill record. */
  currency?: string;
  /** Data scope field on plus agent skill record. */
  data_scope?: number;
  /** Default config field on plus agent skill record. */
  default_config?: Record<string, JsonValue>;
  /** Description field on plus agent skill record. */
  description?: string;
  /** Documentation url field on plus agent skill record. */
  documentation_url?: string;
  /** Enabled field on plus agent skill record. */
  enabled?: boolean;
  /** Entrypoint field on plus agent skill record. */
  entrypoint?: string;
  /** Featured field on plus agent skill record. */
  featured?: boolean;
  /** Homepage url field on plus agent skill record. */
  homepage_url?: string;
  /** Icon field on plus agent skill record. */
  icon?: MediaResource;
  /** Id field on plus agent skill record. */
  id?: string;
  /** Install count field on plus agent skill record. */
  install_count?: string;
  /** Is builtin field on plus agent skill record. */
  is_builtin?: boolean;
  /** Latest published at field on plus agent skill record. */
  latest_published_at?: string;
  /** License name field on plus agent skill record. */
  license_name?: string;
  /** Manifest url field on plus agent skill record. */
  manifest_url?: string;
  /** Market status field on plus agent skill record. */
  market_status?: string;
  /** Name field on plus agent skill record. */
  name?: string;
  /** Organization id field on plus agent skill record. */
  organization_id?: string;
  /** Package id field on plus agent skill record. */
  package_id?: string;
  /** Price field on plus agent skill record. */
  price?: string;
  /** Provider field on plus agent skill record. */
  provider?: string;
  /** Rating avg field on plus agent skill record. */
  rating_avg?: string;
  /** Rating count field on plus agent skill record. */
  rating_count?: string;
  /** Recommend weight field on plus agent skill record. */
  recommend_weight?: number;
  /** Repository url field on plus agent skill record. */
  repository_url?: string;
  /** Review comment field on plus agent skill record. */
  review_comment?: string;
  /** Review status field on plus agent skill record. */
  review_status?: string;
  /** Reviewed at field on plus agent skill record. */
  reviewed_at?: string;
  /** Reviewed by field on plus agent skill record. */
  reviewed_by?: string;
  /** Runtime field on plus agent skill record. */
  runtime?: string;
  /** Skill key field on plus agent skill record. */
  skill_key?: string;
  /** Source type field on plus agent skill record. */
  source_type?: string;
  /** Summary field on plus agent skill record. */
  summary?: string;
  /** Tags field on plus agent skill record. */
  tags?: Record<string, JsonValue>;
  /** Tenant id field on plus agent skill record. */
  tenant_id?: string;
  /** Updated at field on plus agent skill record. */
  updated_at?: string;
  /** User id field on plus agent skill record. */
  user_id?: string;
  /** Uuid field on plus agent skill record. */
  uuid?: string;
  /** V field on plus agent skill record. */
  v?: string;
  /** Version field on plus agent skill record. */
  version?: string;
  /** Version name field on plus agent skill record. */
  version_name?: string;
  /** Visibility field on plus agent skill record. */
  visibility?: string;
}
