package types

// Ai config change event record schema exposed by Claw Router.
type AiConfigChangeEventRecord struct {
	ChangedObjectId string `json:"changed_object_id"`
	ChangedObjectType string `json:"changed_object_type"`
	ConfigScope string `json:"config_scope"`
	ConfigVersion string `json:"config_version"`
	CreatedAt string `json:"created_at"`
	EventPayload map[string]JsonValue `json:"event_payload"`
	EventStatus string `json:"event_status"`
	Id string `json:"id"`
	LastErrorMessage string `json:"last_error_message"`
	LegalHold bool `json:"legal_hold"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	PayloadHash string `json:"payload_hash"`
	PublishAttempts int `json:"publish_attempts"`
	PublishedAt string `json:"published_at"`
	RequestId string `json:"request_id"`
	RetentionUntil string `json:"retention_until"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	TraceId string `json:"trace_id"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
}
