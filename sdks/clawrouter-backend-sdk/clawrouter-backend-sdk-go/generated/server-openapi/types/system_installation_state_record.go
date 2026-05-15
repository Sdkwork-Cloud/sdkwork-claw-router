package types

// System installation state record schema exposed by Claw Router.
type SystemInstallationStateRecord struct {
	CatalogVersion string `json:"catalog_version"`
	DatabaseEngine string `json:"database_engine"`
	Environment string `json:"environment"`
	Id string `json:"id"`
	InstallationId string `json:"installation_id"`
	InstalledAt string `json:"installed_at"`
	LastCheckedAt string `json:"last_checked_at"`
	Metadata map[string]JsonValue `json:"metadata"`
	SchemaVersion string `json:"schema_version"`
	SeedProfile string `json:"seed_profile"`
	Status string `json:"status"`
	UpgradedAt string `json:"upgraded_at"`
}
