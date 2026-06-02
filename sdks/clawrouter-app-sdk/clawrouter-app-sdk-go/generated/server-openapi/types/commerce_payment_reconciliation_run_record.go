package types

// Commerce payment reconciliation run record schema exposed by Claw Router.
type CommercePaymentReconciliationRunRecord struct {
	CompletedAt string `json:"completed_at"`
	CreatedAt string `json:"created_at"`
	DifferenceAmount string `json:"difference_amount"`
	Id string `json:"id"`
	IdempotencyKey string `json:"idempotency_key"`
	MatchedCount string `json:"matched_count"`
	MismatchedCount string `json:"mismatched_count"`
	MissingInternalCount string `json:"missing_internal_count"`
	MissingProviderCount string `json:"missing_provider_count"`
	OrganizationId string `json:"organization_id"`
	PeriodEnd string `json:"period_end"`
	PeriodStart string `json:"period_start"`
	ProviderAccountId string `json:"provider_account_id"`
	ProviderCode string `json:"provider_code"`
	ReportFileRef string `json:"report_file_ref"`
	RequestNo string `json:"request_no"`
	RunNo string `json:"run_no"`
	SettlementCurrency string `json:"settlement_currency"`
	StartedAt string `json:"started_at"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	TotalInternalAmount string `json:"total_internal_amount"`
	TotalProviderAmount string `json:"total_provider_amount"`
	UpdatedAt string `json:"updated_at"`
}
