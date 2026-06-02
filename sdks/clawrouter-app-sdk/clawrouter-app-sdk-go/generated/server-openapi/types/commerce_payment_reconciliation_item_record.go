package types

// Commerce payment reconciliation item record schema exposed by Claw Router.
type CommercePaymentReconciliationItemRecord struct {
	CreatedAt string `json:"created_at"`
	CurrencyCode string `json:"currency_code"`
	DifferenceAmount string `json:"difference_amount"`
	DifferenceType string `json:"difference_type"`
	Id string `json:"id"`
	InternalAmount string `json:"internal_amount"`
	InternalStatus string `json:"internal_status"`
	MatchStatus string `json:"match_status"`
	OrganizationId string `json:"organization_id"`
	PaymentAttemptId string `json:"payment_attempt_id"`
	ProviderAmount string `json:"provider_amount"`
	ProviderCode string `json:"provider_code"`
	ProviderStatus string `json:"provider_status"`
	ReconciliationRunId string `json:"reconciliation_run_id"`
	RefundAttemptId string `json:"refund_attempt_id"`
	RefundId string `json:"refund_id"`
	ResolutionNote string `json:"resolution_note"`
	ResolutionStatus string `json:"resolution_status"`
	ResolvedAt string `json:"resolved_at"`
	ResolvedBy string `json:"resolved_by"`
	StatementId string `json:"statement_id"`
	StatementItemId string `json:"statement_item_id"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
}
