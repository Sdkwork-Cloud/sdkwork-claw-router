package types

// Commerce invoice item record schema exposed by Claw Router.
type CommerceInvoiceItemRecord struct {
	Amount string `json:"amount"`
	CreatedAt string `json:"created_at"`
	InvoiceId string `json:"invoice_id"`
	OrderItemId string `json:"order_item_id"`
	TenantId string `json:"tenant_id"`
	Title string `json:"title"`
}
