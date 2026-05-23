package types

// Ai memory event record schema exposed by Claw Router.
type AiMemoryEventRecord struct {
	ActorId string `json:"actor_id"`
	ActorType string `json:"actor_type"`
	AfterJson map[string]JsonValue `json:"after_json"`
	BeforeJson map[string]JsonValue `json:"before_json"`
	ConversationId string `json:"conversation_id"`
	CreatedAt string `json:"created_at"`
	DecisionReason string `json:"decision_reason"`
	EventType string `json:"event_type"`
	Id string `json:"id"`
	InvocationId string `json:"invocation_id"`
	LegalHold bool `json:"legal_hold"`
	MemoryId string `json:"memory_id"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	PayloadHash string `json:"payload_hash"`
	RequestId string `json:"request_id"`
	RetentionUntil string `json:"retention_until"`
	SpaceId string `json:"space_id"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	TraceId string `json:"trace_id"`
	TurnId string `json:"turn_id"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
}
