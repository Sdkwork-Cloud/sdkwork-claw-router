package types

// Ops inbox event record schema exposed by Claw Router.
type OpsInboxEventRecord struct {
	ConsumerName string `json:"consumer_name"`
	CreatedAt string `json:"created_at"`
	EventType string `json:"event_type"`
	EventVersion int `json:"event_version"`
	FailureReason string `json:"failure_reason"`
	Id string `json:"id"`
	LegalHold bool `json:"legal_hold"`
	MessageId string `json:"message_id"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	PayloadHash string `json:"payload_hash"`
	ProcessStatus string `json:"process_status"`
	ProcessedAt string `json:"processed_at"`
	RequestId string `json:"request_id"`
	RetentionUntil string `json:"retention_until"`
	RetryCount int `json:"retry_count"`
	SourceSystem string `json:"source_system"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	TraceId string `json:"trace_id"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
}
