package types

// Integration service provider record schema exposed by Claw Router.
type IntegrationServiceProviderRecord struct {
	ActivatedAt string `json:"activated_at"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DefaultCurrency string `json:"default_currency"`
	DefaultTimezone string `json:"default_timezone"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	DisplayName string `json:"display_name"`
	Id string `json:"id"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	OwnerOrganizationId string `json:"owner_organization_id"`
	OwnerTenantId string `json:"owner_tenant_id"`
	OwnerUserId string `json:"owner_user_id"`
	ProviderNo string `json:"provider_no"`
	ProviderType string `json:"provider_type"`
	RiskLevel string `json:"risk_level"`
	Status string `json:"status"`
	SuspendedAt string `json:"suspended_at"`
	SuspendedReasonCode string `json:"suspended_reason_code"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}
