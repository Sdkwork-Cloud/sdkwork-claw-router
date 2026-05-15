package types

// System schema migration record schema exposed by Claw Router.
type SystemSchemaMigrationRecord struct {
	Checksum string `json:"checksum"`
	ErrorMessage string `json:"error_message"`
	FinishedAt string `json:"finished_at"`
	Id string `json:"id"`
	MigrationKey string `json:"migration_key"`
	MigrationVersion string `json:"migration_version"`
	StartedAt string `json:"started_at"`
	Status string `json:"status"`
}
