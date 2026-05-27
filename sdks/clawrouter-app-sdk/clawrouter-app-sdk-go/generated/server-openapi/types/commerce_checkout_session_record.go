package types

// Commerce checkout session record schema exposed by Claw Router.
type CommerceCheckoutSessionRecord struct {
	CheckoutSessionNo string `json:"checkout_session_no"`
	CreatedAt string `json:"created_at"`
	CurrencyCode string `json:"currency_code"`
	ExpiresAt string `json:"expires_at"`
	IdempotencyKey string `json:"idempotency_key"`
	OrganizationId string `json:"organization_id"`
	OwnerUserId string `json:"owner_user_id"`
	RequestHash string `json:"request_hash"`
	SourceId string `json:"source_id"`
	SourceType string `json:"source_type"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
}
