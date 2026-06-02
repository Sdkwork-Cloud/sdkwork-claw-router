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
	MediaResourceId string `json:"media_resource_id"`
	MessageId string `json:"message_id"`
	Metadata map[string]JsonValue `json:"metadata"`
	MimeType string `json:"mime_type"`
	Name string `json:"name"`
	ObjectBlobId string `json:"object_blob_id"`
	OrganizationId string `json:"organization_id"`
	PayloadHash string `json:"payload_hash"`
	RequestId string `json:"request_id"`
	ResourceSnapshot map[string]JsonValue `json:"resource_snapshot"`
	RetentionUntil string `json:"retention_until"`
	RuntimeInvocationId string `json:"runtime_invocation_id"`
	Sha256 string `json:"sha256"`
	SizeBytes string `json:"size_bytes"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	TraceId string `json:"trace_id"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
}
