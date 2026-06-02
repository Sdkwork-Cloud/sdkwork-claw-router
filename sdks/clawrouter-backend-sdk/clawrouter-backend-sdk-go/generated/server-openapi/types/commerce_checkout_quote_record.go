package types

// Commerce checkout quote record schema exposed by Claw Router.
type CommerceCheckoutQuoteRecord struct {
	CheckoutSessionId string `json:"checkout_session_id"`
	CreatedAt string `json:"created_at"`
	CurrencyCode string `json:"currency_code"`
	DiscountAmount string `json:"discount_amount"`
	ExpiresAt string `json:"expires_at"`
	Id string `json:"id"`
	OrganizationId string `json:"organization_id"`
	OriginalAmount string `json:"original_amount"`
	PayableAmount string `json:"payable_amount"`
	QuoteNo string `json:"quote_no"`
	ShippingAmount string `json:"shipping_amount"`
	TaxAmount string `json:"tax_amount"`
	TenantId string `json:"tenant_id"`
}
