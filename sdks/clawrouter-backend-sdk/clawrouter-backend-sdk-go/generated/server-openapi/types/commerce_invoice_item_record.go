package types

// Commerce invoice item record schema exposed by Claw Router.
type CommerceInvoiceItemRecord struct {
	Amount string `json:"amount"`
	CreatedAt string `json:"created_at"`
	Id string `json:"id"`
	InvoiceId string `json:"invoice_id"`
	OrderItemId string `json:"order_item_id"`
	TaxAmount string `json:"tax_amount"`
	TenantId string `json:"tenant_id"`
	Title string `json:"title"`
}
