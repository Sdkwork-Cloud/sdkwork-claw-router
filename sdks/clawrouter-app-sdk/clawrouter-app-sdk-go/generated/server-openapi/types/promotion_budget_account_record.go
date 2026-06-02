package types

// Promotion budget account record schema exposed by Claw Router.
type PromotionBudgetAccountRecord struct {
	AvailableAmountMinor string `json:"available_amount_minor"`
	AvailableQuantity string `json:"available_quantity"`
	BudgetNo string `json:"budget_no"`
	BudgetType string `json:"budget_type"`
	ConsumedAmountMinor string `json:"consumed_amount_minor"`
	ConsumedQuantity string `json:"consumed_quantity"`
	CreatedAt string `json:"created_at"`
	CreatedBy string `json:"created_by"`
	CurrencyCode string `json:"currency_code"`
	Id string `json:"id"`
	LockMode string `json:"lock_mode"`
	OfferId string `json:"offer_id"`
	OfferVersionId string `json:"offer_version_id"`
	OrganizationId string `json:"organization_id"`
	OverrunAmountMinor string `json:"overrun_amount_minor"`
	PlannedAmountMinor string `json:"planned_amount_minor"`
	ReservedAmountMinor string `json:"reserved_amount_minor"`
	ReservedQuantity string `json:"reserved_quantity"`
	Status string `json:"status"`
	StockId string `json:"stock_id"`
	TenantId string `json:"tenant_id"`
	TotalAmountMinor string `json:"total_amount_minor"`
	TotalQuantity string `json:"total_quantity"`
	UpdatedAt string `json:"updated_at"`
	UpdatedBy string `json:"updated_by"`
}
