package types

// Content doc page record schema exposed by Claw Router.
type ContentDocPageRecord struct {
	ContentHash string `json:"content_hash"`
	ContentSource string `json:"content_source"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	DocCode string `json:"doc_code"`
	DocType string `json:"doc_type"`
	Id string `json:"id"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	Path string `json:"path"`
	PublishedAt string `json:"published_at"`
	Slug string `json:"slug"`
	SortOrder int `json:"sort_order"`
	SourceRef string `json:"source_ref"`
	Status string `json:"status"`
	Summary string `json:"summary"`
	TenantId string `json:"tenant_id"`
	Title string `json:"title"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}
