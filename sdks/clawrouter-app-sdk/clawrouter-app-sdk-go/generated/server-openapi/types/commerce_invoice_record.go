package types

// Commerce invoice record schema exposed by Claw Router.
type CommerceInvoiceRecord struct {
	CreatedAt string `json:"created_at"`
	Document MediaResource `json:"document"`
	Id string `json:"id"`
	InvoiceCode string `json:"invoice_code"`
	InvoiceNo string `json:"invoice_no"`
	IssuedAt string `json:"issued_at"`
	OrderId string `json:"order_id"`
	OrganizationId string `json:"organization_id"`
	OwnerUserId string `json:"owner_user_id"`
	PaymentId string `json:"payment_id"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	TitleId string `json:"title_id"`
	UpdatedAt string `json:"updated_at"`
}
