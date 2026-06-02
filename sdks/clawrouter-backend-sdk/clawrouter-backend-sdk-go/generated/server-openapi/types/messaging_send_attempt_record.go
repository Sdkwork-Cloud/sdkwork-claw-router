package types

// Messaging send attempt record schema exposed by Claw Router.
type MessagingSendAttemptRecord struct {
	AttemptNo int `json:"attempt_no"`
	AttemptedAt string `json:"attempted_at"`
	CreatedAt string `json:"created_at"`
	FailureCode string `json:"failure_code"`
	FailureMessageMasked string `json:"failure_message_masked"`
	HttpStatus int `json:"http_status"`
	Id string `json:"id"`
	LatencyMs int `json:"latency_ms"`
	LegalHold bool `json:"legal_hold"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	PayloadHash string `json:"payload_hash"`
	ProviderAccountId string `json:"provider_account_id"`
	ProviderCode string `json:"provider_code"`
	ProviderMessageId string `json:"provider_message_id"`
	ProviderRequestId string `json:"provider_request_id"`
	ProviderStatus string `json:"provider_status"`
	RequestId string `json:"request_id"`
	RetentionUntil string `json:"retention_until"`
	RetryAfterAt string `json:"retry_after_at"`
	SendRequestId string `json:"send_request_id"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	TraceId string `json:"trace_id"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
}
