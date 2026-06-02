package types

// Ai runtime usage link record schema exposed by Claw Router.
type AiRuntimeUsageLinkRecord struct {
	AgentRunId string `json:"agent_run_id"`
	AgentRunStepId string `json:"agent_run_step_id"`
	AgentRunStepIdKey string `json:"agent_run_step_id_key"`
	AgentSessionId string `json:"agent_session_id"`
	CachedTokens string `json:"cached_tokens"`
	ChatItemId string `json:"chat_item_id"`
	ChatTurnId string `json:"chat_turn_id"`
	ConversationId string `json:"conversation_id"`
	CostAmount string `json:"cost_amount"`
	CreatedAt string `json:"created_at"`
	Currency string `json:"currency"`
	Id string `json:"id"`
	InputTokens string `json:"input_tokens"`
	LegalHold bool `json:"legal_hold"`
	MessageId string `json:"message_id"`
	Metadata map[string]JsonValue `json:"metadata"`
	Model string `json:"model"`
	OccurredAt string `json:"occurred_at"`
	OrganizationId string `json:"organization_id"`
	OutputTokens string `json:"output_tokens"`
	PayloadHash string `json:"payload_hash"`
	Provider string `json:"provider"`
	ReasoningTokens string `json:"reasoning_tokens"`
	RequestId string `json:"request_id"`
	RetentionUntil string `json:"retention_until"`
	RuntimeInvocationId string `json:"runtime_invocation_id"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	TotalTokens string `json:"total_tokens"`
	TraceId string `json:"trace_id"`
	UsageFactId string `json:"usage_fact_id"`
	UsageType string `json:"usage_type"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
}
