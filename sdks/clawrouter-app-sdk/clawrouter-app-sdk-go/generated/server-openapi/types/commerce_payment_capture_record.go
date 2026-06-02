package types

// Commerce payment capture record schema exposed by Claw Router.
type CommercePaymentCaptureRecord struct {
	Amount string `json:"amount"`
	CaptureNo string `json:"capture_no"`
	CreatedAt string `json:"created_at"`
	CurrencyCode string `json:"currency_code"`
	FailedAt string `json:"failed_at"`
	FailureCode string `json:"failure_code"`
	FailureMessage string `json:"failure_message"`
	FinalCapture string `json:"final_capture"`
	Id string `json:"id"`
	IdempotencyKey string `json:"idempotency_key"`
	NativeCaptureId string `json:"native_capture_id"`
	OrganizationId string `json:"organization_id"`
	PaymentAttemptId string `json:"payment_attempt_id"`
	ProviderAccountId string `json:"provider_account_id"`
	ProviderCode string `json:"provider_code"`
	RequestNo string `json:"request_no"`
	Status string `json:"status"`
	SubmittedAt string `json:"submitted_at"`
	SucceededAt string `json:"succeeded_at"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
}
