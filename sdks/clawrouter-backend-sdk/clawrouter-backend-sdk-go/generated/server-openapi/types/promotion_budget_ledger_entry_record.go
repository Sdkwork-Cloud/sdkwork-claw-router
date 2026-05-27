package types

// Promotion budget ledger entry record schema exposed by Claw Router.
type PromotionBudgetLedgerEntryRecord struct {
	ApplicationId string `json:"application_id"`
	BudgetAccountId string `json:"budget_account_id"`
	BusinessType string `json:"business_type"`
	CreatedAt string `json:"created_at"`
	CurrencyCode string `json:"currency_code"`
	Direction string `json:"direction"`
	IdempotencyKey string `json:"idempotency_key"`
	LedgerNo string `json:"ledger_no"`
	OccurredAt string `json:"occurred_at"`
	OrganizationId string `json:"organization_id"`
	RequestNo string `json:"request_no"`
	SourceId string `json:"source_id"`
	SourceType string `json:"source_type"`
	TenantId string `json:"tenant_id"`
}
