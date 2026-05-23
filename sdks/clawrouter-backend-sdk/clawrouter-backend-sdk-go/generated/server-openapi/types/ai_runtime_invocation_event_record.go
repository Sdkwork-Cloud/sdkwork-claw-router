package types

// Ai runtime invocation event record schema exposed by Claw Router.
type AiRuntimeInvocationEventRecord struct {
	AgentRunId string `json:"agent_run_id"`
	AgentRunStepId string `json:"agent_run_step_id"`
	AgentSessionId string `json:"agent_session_id"`
	ChatTurnId string `json:"chat_turn_id"`
	ConversationId string `json:"conversation_id"`
	CreatedAt string `json:"created_at"`
	EventNo string `json:"event_no"`
	EventSource string `json:"event_source"`
	EventType string `json:"event_type"`
	Id string `json:"id"`
	InvocationId string `json:"invocation_id"`
	LegalHold bool `json:"legal_hold"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	PayloadHash string `json:"payload_hash"`
	PayloadJson map[string]JsonValue `json:"payload_json"`
	RequestId string `json:"request_id"`
	RetentionUntil string `json:"retention_until"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	TextDelta string `json:"text_delta"`
	TraceId string `json:"trace_id"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
}
