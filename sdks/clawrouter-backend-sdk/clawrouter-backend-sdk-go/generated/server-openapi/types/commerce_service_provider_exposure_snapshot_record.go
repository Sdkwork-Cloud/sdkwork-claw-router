package types

// Commerce service provider exposure snapshot record schema exposed by Claw Router.
type CommerceServiceProviderExposureSnapshotRecord struct {
	BalanceAmount string `json:"balance_amount"`
	CalculatedAt string `json:"calculated_at"`
	CreatedAt string `json:"created_at"`
	CreditLimitAmount string `json:"credit_limit_amount"`
	Currency string `json:"currency"`
	ExposureAmount string `json:"exposure_amount"`
	FrozenAmount string `json:"frozen_amount"`
	Id string `json:"id"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	OverdueAmount string `json:"overdue_amount"`
	PendingSettlementAmount string `json:"pending_settlement_amount"`
	RebuildVersion string `json:"rebuild_version"`
	RiskStatus string `json:"risk_status"`
	ServiceProviderId string `json:"service_provider_id"`
	SourceId string `json:"source_id"`
	SourceType string `json:"source_type"`
	SourceVersion string `json:"source_version"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	UsedCreditAmount string `json:"used_credit_amount"`
	Uuid string `json:"uuid"`
}
