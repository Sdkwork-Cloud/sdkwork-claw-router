package types

// Studio catalog artifact record schema exposed by Claw Router.
type StudioCatalogArtifactRecord struct {
	ArtifactRef string `json:"artifact_ref"`
	ArtifactSizeBytes string `json:"artifact_size_bytes"`
	ArtifactType string `json:"artifact_type"`
	ArtifactUrl string `json:"artifact_url"`
	ChecksumHash string `json:"checksum_hash"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	DeprecatedAt string `json:"deprecated_at"`
	Frameworks map[string]JsonValue `json:"frameworks"`
	Id string `json:"id"`
	LicenseName string `json:"license_name"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	OsName string `json:"os_name"`
	PlatformType string `json:"platform_type"`
	PublishedAt string `json:"published_at"`
	ReleaseNotes string `json:"release_notes"`
	Runtime string `json:"runtime"`
	Status string `json:"status"`
	TargetId string `json:"target_id"`
	TargetType string `json:"target_type"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}
