package types

// Commerce payment webhook delivery record schema exposed by Claw Router.
type CommercePaymentWebhookDeliveryRecord struct {
	CreatedAt string `json:"created_at"`
	DeliveryNo string `json:"delivery_no"`
	DeliveryStatus string `json:"delivery_status"`
	EventId string `json:"event_id"`
	FailureCode string `json:"failure_code"`
	FailureMessage string `json:"failure_message"`
	HeadersJson map[string]JsonValue `json:"headers_json"`
	Id string `json:"id"`
	Nonce string `json:"nonce"`
	NormalizedEventId string `json:"normalized_event_id"`
	OrganizationId string `json:"organization_id"`
	PayloadDigest string `json:"payload_digest"`
	PayloadRef string `json:"payload_ref"`
	ProcessedAt string `json:"processed_at"`
	ProviderAccountId string `json:"provider_account_id"`
	ProviderCode string `json:"provider_code"`
	ReceivedAt string `json:"received_at"`
	RequestTimestamp string `json:"request_timestamp"`
	Signature string `json:"signature"`
	SignatureAlgorithm string `json:"signature_algorithm"`
	SourceIp string `json:"source_ip"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	UserAgent string `json:"user_agent"`
	VerificationStatus string `json:"verification_status"`
	VerifiedAt string `json:"verified_at"`
}
