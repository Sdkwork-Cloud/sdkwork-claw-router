package types

// Content sdk release record schema exposed by Claw Router.
type ContentSdkReleaseRecord struct {
	ApiSystem string `json:"api_system"`
	ArtifactManifest map[string]JsonValue `json:"artifact_manifest"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DefaultBaseUrl string `json:"default_base_url"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	DocsUrl string `json:"docs_url"`
	ExampleCode string `json:"example_code"`
	ExampleManifest map[string]JsonValue `json:"example_manifest"`
	GithubUrl string `json:"github_url"`
	Id string `json:"id"`
	ImportCode string `json:"import_code"`
	InitCode string `json:"init_code"`
	InstallCommand string `json:"install_command"`
	Language string `json:"language"`
	LanguageDescription string `json:"language_description"`
	LanguageIcon string `json:"language_icon"`
	Metadata map[string]JsonValue `json:"metadata"`
	OpenapiSnapshotId string `json:"openapi_snapshot_id"`
	OrganizationId string `json:"organization_id"`
	PackageManager string `json:"package_manager"`
	PackageName string `json:"package_name"`
	PublishedAt string `json:"published_at"`
	SourceRepo string `json:"source_repo"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}
