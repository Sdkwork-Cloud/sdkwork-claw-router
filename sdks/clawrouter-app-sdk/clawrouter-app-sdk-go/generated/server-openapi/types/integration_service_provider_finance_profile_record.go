package types

// Integration service provider finance profile record schema exposed by Claw Router.
type IntegrationServiceProviderFinanceProfileRecord struct {
	BillingCycle string `json:"billing_cycle"`
	CreatedAt string `json:"created_at"`
	CreditLimitAmount string `json:"credit_limit_amount"`
	Currency string `json:"currency"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	Id string `json:"id"`
	InvoiceTitleId string `json:"invoice_title_id"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	PaymentTermsDays int `json:"payment_terms_days"`
	ServiceProviderId string `json:"service_provider_id"`
	SettlementDay int `json:"settlement_day"`
	SettlementMode string `json:"settlement_mode"`
	Status string `json:"status"`
	SuspendThresholdAmount string `json:"suspend_threshold_amount"`
	TaxProfileRef string `json:"tax_profile_ref"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
	WarningThresholdAmount string `json:"warning_threshold_amount"`
}
