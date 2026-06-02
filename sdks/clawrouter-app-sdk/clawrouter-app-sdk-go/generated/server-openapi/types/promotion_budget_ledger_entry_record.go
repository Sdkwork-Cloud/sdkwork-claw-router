package types

// Promotion budget ledger entry record schema exposed by Claw Router.
type PromotionBudgetLedgerEntryRecord struct {
	AmountDeltaMinor string `json:"amount_delta_minor"`
	ApplicationId string `json:"application_id"`
	BalanceAmountMinor string `json:"balance_amount_minor"`
	BalanceQuantity string `json:"balance_quantity"`
	BudgetAccountId string `json:"budget_account_id"`
	BusinessType string `json:"business_type"`
	CreatedAt string `json:"created_at"`
	CurrencyCode string `json:"currency_code"`
	Direction string `json:"direction"`
	Id string `json:"id"`
	IdempotencyKey string `json:"idempotency_key"`
	LedgerNo string `json:"ledger_no"`
	OccurredAt string `json:"occurred_at"`
	OrganizationId string `json:"organization_id"`
	QuantityDelta string `json:"quantity_delta"`
	RequestNo string `json:"request_no"`
	SourceId string `json:"source_id"`
	SourceType string `json:"source_type"`
	TenantId string `json:"tenant_id"`
}
