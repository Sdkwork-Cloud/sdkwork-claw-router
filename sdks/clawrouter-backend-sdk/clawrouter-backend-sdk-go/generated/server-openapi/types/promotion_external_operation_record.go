package types

// Promotion external operation record schema exposed by Claw Router.
type PromotionExternalOperationRecord struct {
	AggregateId string `json:"aggregate_id"`
	AggregateType string `json:"aggregate_type"`
	BindingId string `json:"binding_id"`
	CallbackAt string `json:"callback_at"`
	CallbackId string `json:"callback_id"`
	CallbackSigHash string `json:"callback_sig_hash"`
	CancelUntil string `json:"cancel_until"`
	CreatedAt string `json:"created_at"`
	ErrorCode string `json:"error_code"`
	ErrorMessage string `json:"error_message"`
	ExternalOperationId string `json:"external_operation_id"`
	ExternalRequestNo string `json:"external_request_no"`
	ExternalStatus string `json:"external_status"`
	Id string `json:"id"`
	IdempotencyKey string `json:"idempotency_key"`
	NextRetryAt string `json:"next_retry_at"`
	OccurredAt string `json:"occurred_at"`
	OperationNo string `json:"operation_no"`
	OperationType string `json:"operation_type"`
	OrganizationId string `json:"organization_id"`
	Platform string `json:"platform"`
	ProviderCode string `json:"provider_code"`
	ProviderRequestId string `json:"provider_request_id"`
	ReplayOpId string `json:"replay_op_id"`
	RequestHash string `json:"request_hash"`
	ResponseHash string `json:"response_hash"`
	RetryCount int `json:"retry_count"`
	SanitizedRequestJson map[string]JsonValue `json:"sanitized_request_json"`
	SanitizedResponseJson map[string]JsonValue `json:"sanitized_response_json"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
}
