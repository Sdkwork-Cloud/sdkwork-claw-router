package types

// Ai chat turn record schema exposed by Claw Router.
type AiChatTurnRecord struct {
	AgentId string `json:"agent_id"`
	AgentSessionId string `json:"agent_session_id"`
	BranchId string `json:"branch_id"`
	CachedTokenTotal string `json:"cached_token_total"`
	CompletedAt string `json:"completed_at"`
	ContextSnapshotId string `json:"context_snapshot_id"`
	ConversationId string `json:"conversation_id"`
	CostAmount string `json:"cost_amount"`
	CreatedAt string `json:"created_at"`
	Currency string `json:"currency"`
	Endpoint string `json:"endpoint"`
	FinalOutputItemId string `json:"final_output_item_id"`
	Id string `json:"id"`
	InputItemId string `json:"input_item_id"`
	InputTokenTotal string `json:"input_token_total"`
	LegalHold bool `json:"legal_hold"`
	Metadata map[string]JsonValue `json:"metadata"`
	Model string `json:"model"`
	OrganizationId string `json:"organization_id"`
	OutputTokenTotal string `json:"output_token_total"`
	ParentTurnId string `json:"parent_turn_id"`
	PayloadHash string `json:"payload_hash"`
	Provider string `json:"provider"`
	ReasoningTokenTotal string `json:"reasoning_token_total"`
	RequestId string `json:"request_id"`
	RequestSnapshot map[string]JsonValue `json:"request_snapshot"`
	ResponseSnapshot map[string]JsonValue `json:"response_snapshot"`
	RetentionUntil string `json:"retention_until"`
	RuntimeInvocationId string `json:"runtime_invocation_id"`
	StartedAt string `json:"started_at"`
	Status string `json:"status"`
	Streaming bool `json:"streaming"`
	TenantId string `json:"tenant_id"`
	TraceId string `json:"trace_id"`
	TurnNo string `json:"turn_no"`
	UpdatedAt string `json:"updated_at"`
	UsageSnapshot map[string]JsonValue `json:"usage_snapshot"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
}
