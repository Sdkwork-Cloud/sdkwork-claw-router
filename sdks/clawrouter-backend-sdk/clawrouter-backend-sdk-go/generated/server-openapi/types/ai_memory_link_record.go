package types

// Ai memory link record schema exposed by Claw Router.
type AiMemoryLinkRecord struct {
	AgentRunId string `json:"agent_run_id"`
	AgentRunStepId string `json:"agent_run_step_id"`
	AgentSessionId string `json:"agent_session_id"`
	ChatItemId string `json:"chat_item_id"`
	ChatTurnId string `json:"chat_turn_id"`
	ConversationId string `json:"conversation_id"`
	CreatedAt string `json:"created_at"`
	Id string `json:"id"`
	InjectedTextSnapshot string `json:"injected_text_snapshot"`
	LegalHold bool `json:"legal_hold"`
	LinkType string `json:"link_type"`
	MemoryId string `json:"memory_id"`
	MemorySpaceId string `json:"memory_space_id"`
	MessageId string `json:"message_id"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	PayloadHash string `json:"payload_hash"`
	PolicyDecision string `json:"policy_decision"`
	RecallQuery string `json:"recall_query"`
	RecallRank int `json:"recall_rank"`
	RecallScore string `json:"recall_score"`
	RequestId string `json:"request_id"`
	RetentionUntil string `json:"retention_until"`
	RuntimeInvocationId string `json:"runtime_invocation_id"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	TokenCount string `json:"token_count"`
	TraceId string `json:"trace_id"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
}
