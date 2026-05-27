package types

// Messaging delivery event record schema exposed by Claw Router.
type MessagingDeliveryEventRecord struct {
	CreatedAt string `json:"created_at"`
	Id string `json:"id"`
	LegalHold bool `json:"legal_hold"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	PayloadHash string `json:"payload_hash"`
	ProviderMessageId string `json:"provider_message_id"`
	RequestId string `json:"request_id"`
	RetentionUntil string `json:"retention_until"`
	SendAttemptId string `json:"send_attempt_id"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	TraceId string `json:"trace_id"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
}
