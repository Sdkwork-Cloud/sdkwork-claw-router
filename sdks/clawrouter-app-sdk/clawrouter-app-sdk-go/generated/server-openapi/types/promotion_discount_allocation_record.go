package types

// Promotion discount allocation record schema exposed by Claw Router.
type PromotionDiscountAllocationRecord struct {
	AllocationAmountMinor string `json:"allocation_amount_minor"`
	AllocationRatioBps int `json:"allocation_ratio_bps"`
	ApplicationId string `json:"application_id"`
	CreatedAt string `json:"created_at"`
	CurrencyCode string `json:"currency_code"`
	Id string `json:"id"`
	OrderId string `json:"order_id"`
	OrderItemId string `json:"order_item_id"`
	OrganizationId string `json:"organization_id"`
	SkuId string `json:"sku_id"`
	TenantId string `json:"tenant_id"`
}
