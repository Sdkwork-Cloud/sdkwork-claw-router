package types

// Integration service provider account binding record schema exposed by Claw Router.
type IntegrationServiceProviderAccountBindingRecord struct {
	AccountRole string `json:"account_role"`
	AssetType string `json:"asset_type"`
	CommerceAccountId string `json:"commerce_account_id"`
	CreatedAt string `json:"created_at"`
	Currency string `json:"currency"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	Id string `json:"id"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	ServiceProviderId string `json:"service_provider_id"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}
