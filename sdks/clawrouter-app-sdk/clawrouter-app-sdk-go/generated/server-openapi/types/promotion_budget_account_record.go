package types

// Promotion budget account record schema exposed by Claw Router.
type PromotionBudgetAccountRecord struct {
	BudgetNo string `json:"budget_no"`
	BudgetType string `json:"budget_type"`
	CreatedAt string `json:"created_at"`
	CreatedBy string `json:"created_by"`
	CurrencyCode string `json:"currency_code"`
	LockMode string `json:"lock_mode"`
	OfferId string `json:"offer_id"`
	OfferVersionId string `json:"offer_version_id"`
	OrganizationId string `json:"organization_id"`
	OverrunAmountMinor string `json:"overrun_amount_minor"`
	PlannedAmountMinor string `json:"planned_amount_minor"`
	Status string `json:"status"`
	StockId string `json:"stock_id"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	UpdatedBy string `json:"updated_by"`
}
