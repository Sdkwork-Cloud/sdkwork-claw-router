package types

// Commerce payment dispute record schema exposed by Claw Router.
type CommercePaymentDisputeRecord struct {
	Amount string `json:"amount"`
	ClosedAt string `json:"closed_at"`
	CreatedAt string `json:"created_at"`
	CurrencyCode string `json:"currency_code"`
	DisputeNo string `json:"dispute_no"`
	EvidenceDueAt string `json:"evidence_due_at"`
	Id string `json:"id"`
	NativeDisputeId string `json:"native_dispute_id"`
	OpenedAt string `json:"opened_at"`
	OrganizationId string `json:"organization_id"`
	PaymentAttemptId string `json:"payment_attempt_id"`
	ProviderAccountId string `json:"provider_account_id"`
	ProviderCode string `json:"provider_code"`
	ReasonCode string `json:"reason_code"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
}
