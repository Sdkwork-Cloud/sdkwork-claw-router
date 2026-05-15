/** System schema migration record schema exposed by Claw Router. */
export interface SystemSchemaMigrationRecord {
  /** Checksum field on system schema migration record. */
  checksum?: string;
  /** Error message field on system schema migration record. */
  error_message?: string;
  /** Finished at field on system schema migration record. */
  finished_at?: string;
  /** Id field on system schema migration record. */
  id?: string;
  /** Migration key field on system schema migration record. */
  migration_key?: string;
  /** Migration version field on system schema migration record. */
  migration_version?: string;
  /** Started at field on system schema migration record. */
  started_at?: string;
  /** Status field on system schema migration record. */
  status?: string;
}
