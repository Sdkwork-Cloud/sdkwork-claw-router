package types

// Ai runtime artifact record schema exposed by Claw Router.
type AiRuntimeArtifactRecord struct {
	AgentRunId string `json:"agent_run_id"`
	AgentRunStepId string `json:"agent_run_step_id"`
	AgentSessionId string `json:"agent_session_id"`
	ArtifactType string `json:"artifact_type"`
	ChatItemId string `json:"chat_item_id"`
	ChatTurnId string `json:"chat_turn_id"`
	ContentJson map[string]JsonValue `json:"content_json"`
	ContentText string `json:"content_text"`
	ConversationId string `json:"conversation_id"`
	CreatedAt string `json:"created_at"`
	Id string `json:"id"`
	LegalHold bool `json:"legal_hold"`
	MessageId string `json:"message_id"`
	Metadata map[string]JsonValue `json:"metadata"`
	MimeType string `json:"mime_type"`
	Name string `json:"name"`
	OrganizationId string `json:"organization_id"`
	PayloadHash string `json:"payload_hash"`
	RequestId string `json:"request_id"`
	RetentionUntil string `json:"retention_until"`
	RuntimeInvocationId string `json:"runtime_invocation_id"`
	Sha256 string `json:"sha256"`
	SizeBytes string `json:"size_bytes"`
	Status string `json:"status"`
	StorageKey string `json:"storage_key"`
	StorageUrl string `json:"storage_url"`
	TenantId string `json:"tenant_id"`
	TraceId string `json:"trace_id"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
}
