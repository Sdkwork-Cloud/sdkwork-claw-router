package types

// Commerce refund record schema exposed by Claw Router.
type CommerceRefundRecord struct {
	Amount string `json:"amount"`
	CreatedAt string `json:"created_at"`
	IdempotencyKey string `json:"idempotency_key"`
	PaymentAttemptId string `json:"payment_attempt_id"`
	RefundNo string `json:"refund_no"`
	RequestNo string `json:"request_no"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
}
