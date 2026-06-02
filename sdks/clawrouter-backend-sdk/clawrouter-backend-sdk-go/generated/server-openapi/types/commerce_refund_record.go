package types

// Commerce refund record schema exposed by Claw Router.
type CommerceRefundRecord struct {
	Amount string `json:"amount"`
	CreatedAt string `json:"created_at"`
	CurrencyCode string `json:"currency_code"`
	Id string `json:"id"`
	IdempotencyKey string `json:"idempotency_key"`
	OrganizationId string `json:"organization_id"`
	PaymentAttemptId string `json:"payment_attempt_id"`
	PaymentIntentId string `json:"payment_intent_id"`
	ProviderCode string `json:"provider_code"`
	Reason string `json:"reason"`
	RefundNo string `json:"refund_no"`
	RequestNo string `json:"request_no"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
}
