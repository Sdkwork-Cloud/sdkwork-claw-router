package types

// Commerce checkout quote record schema exposed by Claw Router.
type CommerceCheckoutQuoteRecord struct {
	CheckoutSessionId string `json:"checkout_session_id"`
	CreatedAt string `json:"created_at"`
	CurrencyCode string `json:"currency_code"`
	ExpiresAt string `json:"expires_at"`
	OrganizationId string `json:"organization_id"`
	OriginalAmount string `json:"original_amount"`
	PayableAmount string `json:"payable_amount"`
	QuoteNo string `json:"quote_no"`
	TenantId string `json:"tenant_id"`
}
