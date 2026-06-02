package types

// Commerce payment operation attempt record schema exposed by Claw Router.
type CommercePaymentOperationAttemptRecord struct {
	ChannelId string `json:"channel_id"`
	CompletedAt string `json:"completed_at"`
	CreatedAt string `json:"created_at"`
	HttpStatus string `json:"http_status"`
	Id string `json:"id"`
	IdempotencyKey string `json:"idempotency_key"`
	NativeRefundId string `json:"native_refund_id"`
	NativeRequestId string `json:"native_request_id"`
	NativeTradeId string `json:"native_trade_id"`
	OperationCode string `json:"operation_code"`
	OperationNo string `json:"operation_no"`
	OrganizationId string `json:"organization_id"`
	ProviderAccountId string `json:"provider_account_id"`
	ProviderCode string `json:"provider_code"`
	ProviderErrorCode string `json:"provider_error_code"`
	ProviderErrorMessage string `json:"provider_error_message"`
	RequestDigest string `json:"request_digest"`
	ResponseDigest string `json:"response_digest"`
	Retryable string `json:"retryable"`
	SdkworkResourceId string `json:"sdkwork_resource_id"`
	SdkworkResourceType string `json:"sdkwork_resource_type"`
	StartedAt string `json:"started_at"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
}
