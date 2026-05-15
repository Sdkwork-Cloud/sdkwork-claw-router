package types

// Ops outbox event record schema exposed by Claw Router.
type OpsOutboxEventRecord struct {
	AggregateId string `json:"aggregate_id"`
	AggregateType string `json:"aggregate_type"`
	AggregateUuid string `json:"aggregate_uuid"`
	CreatedAt string `json:"created_at"`
	EventId string `json:"event_id"`
	EventPayload map[string]JsonValue `json:"event_payload"`
	EventType string `json:"event_type"`
	EventVersion int `json:"event_version"`
	FailureReason string `json:"failure_reason"`
	Headers map[string]JsonValue `json:"headers"`
	Id string `json:"id"`
	LegalHold bool `json:"legal_hold"`
	Metadata map[string]JsonValue `json:"metadata"`
	NextRetryAt string `json:"next_retry_at"`
	OrganizationId string `json:"organization_id"`
	PayloadHash string `json:"payload_hash"`
	PublishStatus string `json:"publish_status"`
	PublishedAt string `json:"published_at"`
	RequestId string `json:"request_id"`
	RetentionUntil string `json:"retention_until"`
	RetryCount int `json:"retry_count"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	TraceId string `json:"trace_id"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
}
