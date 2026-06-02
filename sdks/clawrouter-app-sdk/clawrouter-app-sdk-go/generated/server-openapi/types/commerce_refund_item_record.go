package types

// Commerce refund item record schema exposed by Claw Router.
type CommerceRefundItemRecord struct {
	CreatedAt string `json:"created_at"`
	Id string `json:"id"`
	OrderItemId string `json:"order_item_id"`
	OrganizationId string `json:"organization_id"`
	Quantity string `json:"quantity"`
	RefundAmount string `json:"refund_amount"`
	RefundId string `json:"refund_id"`
	ShippingRefundAmount string `json:"shipping_refund_amount"`
	TaxRefundAmount string `json:"tax_refund_amount"`
	TenantId string `json:"tenant_id"`
}
