package types

// Ai model vendor region record schema exposed by Claw Router.
type AiModelVendorRegionRecord struct {
	BillingCurrency string `json:"billing_currency"`
	BillingJurisdiction string `json:"billing_jurisdiction"`
	Capabilities map[string]JsonValue `json:"capabilities"`
	CountryRegion string `json:"country_region"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	Description string `json:"description"`
	DisplayName string `json:"display_name"`
	DocsUrl string `json:"docs_url"`
	Id string `json:"id"`
	LegalName string `json:"legal_name"`
	MarketScope string `json:"market_scope"`
	Metadata map[string]JsonValue `json:"metadata"`
	OpenSource bool `json:"open_source"`
	OperatingRegions map[string]JsonValue `json:"operating_regions"`
	OrganizationId string `json:"organization_id"`
	RegionCode string `json:"region_code"`
	SortOrder int `json:"sort_order"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	VendorCode string `json:"vendor_code"`
	VendorId string `json:"vendor_id"`
	Version string `json:"version"`
	WebsiteUrl string `json:"website_url"`
}
