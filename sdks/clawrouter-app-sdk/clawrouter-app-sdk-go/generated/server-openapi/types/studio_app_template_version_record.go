package types

// Studio app template version record schema exposed by Claw Router.
type StudioAppTemplateVersionRecord struct {
	AppConfigSchema map[string]JsonValue `json:"app_config_schema"`
	ArtifactId string `json:"artifact_id"`
	CapabilityManifest map[string]JsonValue `json:"capability_manifest"`
	Changelog string `json:"changelog"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DefaultAppConfig map[string]JsonValue `json:"default_app_config"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	DependencyManifest map[string]JsonValue `json:"dependency_manifest"`
	DeprecatedAt string `json:"deprecated_at"`
	FileManifest map[string]JsonValue `json:"file_manifest"`
	Id string `json:"id"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	PublishStatus string `json:"publish_status"`
	PublishedAt string `json:"published_at"`
	Status string `json:"status"`
	TemplateId string `json:"template_id"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	VariableSchema map[string]JsonValue `json:"variable_schema"`
	Version string `json:"version"`
	VersionNo string `json:"version_no"`
}
