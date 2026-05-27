package types

// Promotion event outbox record schema exposed by Claw Router.
type PromotionEventOutboxRecord struct {
	AggregateId string `json:"aggregate_id"`
	AggregateType string `json:"aggregate_type"`
	CreatedAt string `json:"created_at"`
	EventNo string `json:"event_no"`
	EventType string `json:"event_type"`
	EventVersion int `json:"event_version"`
	NextRetryAt string `json:"next_retry_at"`
	OccurredAt string `json:"occurred_at"`
	OrganizationId string `json:"organization_id"`
	PayloadHash string `json:"payload_hash"`
	PayloadJson map[string]JsonValue `json:"payload_json"`
	PublishedAt string `json:"published_at"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
}
