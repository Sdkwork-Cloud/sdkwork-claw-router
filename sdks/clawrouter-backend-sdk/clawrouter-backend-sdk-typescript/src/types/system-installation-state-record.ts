import type { JsonValue } from './json-value';

/** System installation state record schema exposed by Claw Router. */
export interface SystemInstallationStateRecord {
  /** Catalog version field on system installation state record. */
  catalog_version?: string;
  /** Database engine field on system installation state record. */
  database_engine?: string;
  /** Environment field on system installation state record. */
  environment?: string;
  /** Id field on system installation state record. */
  id?: string;
  /** Installation id field on system installation state record. */
  installation_id?: string;
  /** Installed at field on system installation state record. */
  installed_at?: string;
  /** Last checked at field on system installation state record. */
  last_checked_at?: string;
  /** Metadata field on system installation state record. */
  metadata?: Record<string, JsonValue>;
  /** Schema version field on system installation state record. */
  schema_version?: string;
  /** Seed profile field on system installation state record. */
  seed_profile?: string;
  /** Status field on system installation state record. */
  status?: string;
  /** Upgraded at field on system installation state record. */
  upgraded_at?: string;
}
