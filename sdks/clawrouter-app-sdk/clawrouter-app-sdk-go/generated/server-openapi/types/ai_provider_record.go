package types

// Ai provider record schema exposed by Claw Router.
type AiProviderRecord struct {
	AuthType string `json:"auth_type"`
	BaseUrl string `json:"base_url"`
	ColorToken string `json:"color_token"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DefaultVendorCode string `json:"default_vendor_code"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	Description string `json:"description"`
	DisplayName string `json:"display_name"`
	DocsUrl string `json:"docs_url"`
	IconUrl string `json:"icon_url"`
	Id string `json:"id"`
	Metadata map[string]JsonValue `json:"metadata"`
	MetadataSchemaVersion string `json:"metadata_schema_version"`
	OrganizationId string `json:"organization_id"`
	ProtocolCode string `json:"protocol_code"`
	ProviderCode string `json:"provider_code"`
	ProviderType string `json:"provider_type"`
	ResourceSchema map[string]JsonValue `json:"resource_schema"`
	SortOrder int `json:"sort_order"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
	WebsiteUrl string `json:"website_url"`
}
