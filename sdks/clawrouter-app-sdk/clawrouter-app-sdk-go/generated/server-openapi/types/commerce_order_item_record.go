package types

// Commerce order item record schema exposed by Claw Router.
type CommerceOrderItemRecord struct {
	CreatedAt string `json:"created_at"`
	Id string `json:"id"`
	OrderId string `json:"order_id"`
	Quantity string `json:"quantity"`
	SkuId string `json:"sku_id"`
	TenantId string `json:"tenant_id"`
	Title string `json:"title"`
	TotalAmount string `json:"total_amount"`
	UnitPriceAmount string `json:"unit_price_amount"`
}
