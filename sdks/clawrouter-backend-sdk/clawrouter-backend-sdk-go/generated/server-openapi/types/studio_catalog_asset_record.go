package types

// Studio catalog asset record schema exposed by Claw Router.
type StudioCatalogAssetRecord struct {
	AltText string `json:"alt_text"`
	ArtifactId string `json:"artifact_id"`
	Asset MediaResource `json:"asset"`
	AssetType string `json:"asset_type"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	DurationSeconds string `json:"duration_seconds"`
	FileSize string `json:"file_size"`
	Height int `json:"height"`
	Id string `json:"id"`
	Metadata map[string]JsonValue `json:"metadata"`
	MimeType string `json:"mime_type"`
	OrganizationId string `json:"organization_id"`
	PublishedAt string `json:"published_at"`
	SortOrder int `json:"sort_order"`
	Status string `json:"status"`
	TargetId string `json:"target_id"`
	TargetType string `json:"target_type"`
	TenantId string `json:"tenant_id"`
	Thumbnail MediaResource `json:"thumbnail"`
	Title string `json:"title"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
	Width int `json:"width"`
}
