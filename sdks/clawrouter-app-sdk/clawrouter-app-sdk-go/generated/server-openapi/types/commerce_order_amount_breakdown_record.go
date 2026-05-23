package types

// Commerce order amount breakdown record schema exposed by Claw Router.
type CommerceOrderAmountBreakdownRecord struct {
	CreatedAt string `json:"created_at"`
	CurrencyCode string `json:"currency_code"`
	DiscountAmount string `json:"discount_amount"`
	OrderId string `json:"order_id"`
	OriginalAmount string `json:"original_amount"`
	PayableAmount string `json:"payable_amount"`
	TenantId string `json:"tenant_id"`
}
