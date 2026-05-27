package types

// Open platform provider record schema exposed by Claw Router.
type OpenPlatformProviderRecord struct {
	Capabilities map[string]JsonValue `json:"capabilities"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	DocsUrl string `json:"docs_url"`
	IconUrl string `json:"icon_url"`
	Id string `json:"id"`
	Metadata map[string]JsonValue `json:"metadata"`
	Name string `json:"name"`
	OrganizationId string `json:"organization_id"`
	Provider string `json:"provider"`
	SortOrder int `json:"sort_order"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
	WebsiteUrl string `json:"website_url"`
}
