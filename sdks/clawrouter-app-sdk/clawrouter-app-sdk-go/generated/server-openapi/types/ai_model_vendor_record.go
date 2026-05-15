package types

// Ai model vendor record schema exposed by Claw Router.
type AiModelVendorRecord struct {
	Capabilities map[string]JsonValue `json:"capabilities"`
	ColorToken string `json:"color_token"`
	CountryRegion string `json:"country_region"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	Description string `json:"description"`
	DisplayName string `json:"display_name"`
	DocsUrl string `json:"docs_url"`
	IconUrl string `json:"icon_url"`
	Id string `json:"id"`
	LegalName string `json:"legal_name"`
	LogoUrl string `json:"logo_url"`
	Metadata map[string]JsonValue `json:"metadata"`
	ModelFamilies map[string]JsonValue `json:"model_families"`
	OpenSource bool `json:"open_source"`
	OrganizationId string `json:"organization_id"`
	SortOrder int `json:"sort_order"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	VendorCode string `json:"vendor_code"`
	VendorType string `json:"vendor_type"`
	Version string `json:"version"`
	WebsiteUrl string `json:"website_url"`
}
