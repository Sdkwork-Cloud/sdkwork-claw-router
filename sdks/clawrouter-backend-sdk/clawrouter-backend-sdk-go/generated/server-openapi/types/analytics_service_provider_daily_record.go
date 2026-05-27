package types

// Analytics service provider daily record schema exposed by Claw Router.
type AnalyticsServiceProviderDailyRecord struct {
	AncestorProviderId string `json:"ancestor_provider_id"`
	CreatedAt string `json:"created_at"`
	Currency string `json:"currency"`
	ExpenseAmount string `json:"expense_amount"`
	FailureCount string `json:"failure_count"`
	Id string `json:"id"`
	IncomeAmount string `json:"income_amount"`
	MarginAmount string `json:"margin_amount"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	ProviderId string `json:"provider_id"`
	RebuildVersion string `json:"rebuild_version"`
	ReportDate string `json:"report_date"`
	RequestCount string `json:"request_count"`
	SourceId string `json:"source_id"`
	SourceType string `json:"source_type"`
	SourceVersion string `json:"source_version"`
	Status string `json:"status"`
	SuccessCount string `json:"success_count"`
	TenantId string `json:"tenant_id"`
	TokenCount string `json:"token_count"`
	UpdatedAt string `json:"updated_at"`
	UpstreamCostAmount string `json:"upstream_cost_amount"`
	Uuid string `json:"uuid"`
}
