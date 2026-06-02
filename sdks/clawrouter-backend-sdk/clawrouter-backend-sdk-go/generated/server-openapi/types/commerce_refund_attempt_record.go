package types

// Commerce refund attempt record schema exposed by Claw Router.
type CommerceRefundAttemptRecord struct {
	Amount string `json:"amount"`
	CreatedAt string `json:"created_at"`
	CurrencyCode string `json:"currency_code"`
	FailedAt string `json:"failed_at"`
	FailureCode string `json:"failure_code"`
	FailureMessage string `json:"failure_message"`
	Id string `json:"id"`
	OrganizationId string `json:"organization_id"`
	OutRefundNo string `json:"out_refund_no"`
	ProviderAccountId string `json:"provider_account_id"`
	ProviderCode string `json:"provider_code"`
	ProviderRefundId string `json:"provider_refund_id"`
	RefundAttemptNo string `json:"refund_attempt_no"`
	RefundId string `json:"refund_id"`
	Status string `json:"status"`
	SubmittedAt string `json:"submitted_at"`
	SucceededAt string `json:"succeeded_at"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
}
