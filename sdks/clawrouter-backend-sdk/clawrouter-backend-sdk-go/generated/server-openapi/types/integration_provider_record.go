package types

// Integration provider record schema exposed by Claw Router.
type IntegrationProviderRecord struct {
	AuthType string `json:"auth_type"`
	BaseUrlTemplate string `json:"base_url_template"`
	Capabilities map[string]JsonValue `json:"capabilities"`
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
	IntegrationType string `json:"integration_type"`
	Metadata map[string]JsonValue `json:"metadata"`
	MetadataSchemaVersion string `json:"metadata_schema_version"`
	OrganizationId string `json:"organization_id"`
	Protocol string `json:"protocol"`
	ProviderCode string `json:"provider_code"`
	SortOrder int `json:"sort_order"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	UpstreamProviderCode string `json:"upstream_provider_code"`
	UpstreamVendorCode string `json:"upstream_vendor_code"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
	WebsiteUrl string `json:"website_url"`
}
