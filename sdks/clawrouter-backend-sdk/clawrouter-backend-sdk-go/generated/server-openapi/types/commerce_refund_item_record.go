package types

// Commerce refund item record schema exposed by Claw Router.
type CommerceRefundItemRecord struct {
	CreatedAt string `json:"created_at"`
	OrderItemId string `json:"order_item_id"`
	OrganizationId string `json:"organization_id"`
	RefundAmount string `json:"refund_amount"`
	RefundId string `json:"refund_id"`
	TenantId string `json:"tenant_id"`
}
