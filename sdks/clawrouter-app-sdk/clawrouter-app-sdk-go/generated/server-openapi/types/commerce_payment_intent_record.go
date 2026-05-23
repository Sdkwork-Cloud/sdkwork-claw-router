package types

// Commerce payment intent record schema exposed by Claw Router.
type CommercePaymentIntentRecord struct {
	Amount string `json:"amount"`
	CreatedAt string `json:"created_at"`
	CurrencyCode string `json:"currency_code"`
	IdempotencyKey string `json:"idempotency_key"`
	OrderId string `json:"order_id"`
	OrganizationId string `json:"organization_id"`
	OwnerUserId string `json:"owner_user_id"`
	Provider string `json:"provider"`
	RequestNo string `json:"request_no"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
}
