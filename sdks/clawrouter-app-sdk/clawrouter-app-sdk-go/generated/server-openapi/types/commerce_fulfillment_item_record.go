package types

// Commerce fulfillment item record schema exposed by Claw Router.
type CommerceFulfillmentItemRecord struct {
	CreatedAt string `json:"created_at"`
	FulfillmentId string `json:"fulfillment_id"`
	Id string `json:"id"`
	OrderItemId string `json:"order_item_id"`
	OrganizationId string `json:"organization_id"`
	Quantity string `json:"quantity"`
	SkuId string `json:"sku_id"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
}
