package types

// Content openapi snapshot record schema exposed by Claw Router.
type ContentOpenapiSnapshotRecord struct {
	ApiSurface string `json:"api_surface"`
	ApiSystem string `json:"api_system"`
	CategoryTree map[string]JsonValue `json:"category_tree"`
	CreatedAt string `json:"created_at"`
	EndpointCount int `json:"endpoint_count"`
	ExampleManifest map[string]JsonValue `json:"example_manifest"`
	Id string `json:"id"`
	Metadata map[string]JsonValue `json:"metadata"`
	OpenapiHash string `json:"openapi_hash"`
	OrganizationId string `json:"organization_id"`
	PublishedAt string `json:"published_at"`
	RebuildVersion string `json:"rebuild_version"`
	SourceId string `json:"source_id"`
	SourceRef string `json:"source_ref"`
	SourceType string `json:"source_type"`
	SourceVersion string `json:"source_version"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	Title string `json:"title"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}
