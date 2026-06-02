package types

// Messaging provider record schema exposed by Claw Router.
type MessagingProviderRecord struct {
	Channel string `json:"channel"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	DisplayName string `json:"display_name"`
	DocsUrl string `json:"docs_url"`
	Icon MediaResource `json:"icon"`
	Id string `json:"id"`
	Metadata map[string]JsonValue `json:"metadata"`
	MetadataSchemaVersion string `json:"metadata_schema_version"`
	OrganizationId string `json:"organization_id"`
	ProviderCode string `json:"provider_code"`
	ProviderType string `json:"provider_type"`
	SortOrder int `json:"sort_order"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
	WebsiteUrl string `json:"website_url"`
}
