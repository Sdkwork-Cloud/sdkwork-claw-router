package types

// Commerce payment webhook event record schema exposed by Claw Router.
type CommercePaymentWebhookEventRecord struct {
	CreatedAt string `json:"created_at"`
	EventId string `json:"event_id"`
	Id string `json:"id"`
	IdempotencyKey string `json:"idempotency_key"`
	Message string `json:"message"`
	Nonce string `json:"nonce"`
	OrganizationId string `json:"organization_id"`
	OutTradeNo string `json:"out_trade_no"`
	PayloadDigest string `json:"payload_digest"`
	ProcessedAt string `json:"processed_at"`
	Provider string `json:"provider"`
	RequestNo string `json:"request_no"`
	RequestTimestamp string `json:"request_timestamp"`
	Signature string `json:"signature"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	TransactionId string `json:"transaction_id"`
	UpdatedAt string `json:"updated_at"`
}
