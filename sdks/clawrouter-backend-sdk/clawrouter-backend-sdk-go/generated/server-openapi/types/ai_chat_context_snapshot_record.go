package types

// Ai chat context snapshot record schema exposed by Claw Router.
type AiChatContextSnapshotRecord struct {
	ContextJson map[string]JsonValue `json:"context_json"`
	ConversationId string `json:"conversation_id"`
	CreatedAt string `json:"created_at"`
	ExcludedItemIds map[string]JsonValue `json:"excluded_item_ids"`
	ExcludedMemoryIds map[string]JsonValue `json:"excluded_memory_ids"`
	Id string `json:"id"`
	IncludedItemIds map[string]JsonValue `json:"included_item_ids"`
	IncludedMemoryIds map[string]JsonValue `json:"included_memory_ids"`
	InputTokenEstimate string `json:"input_token_estimate"`
	LegalHold bool `json:"legal_hold"`
	MemoryPack map[string]JsonValue `json:"memory_pack"`
	MemoryTokenCount string `json:"memory_token_count"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	PayloadHash string `json:"payload_hash"`
	PreviousResponseId string `json:"previous_response_id"`
	ProviderConversationId string `json:"provider_conversation_id"`
	RequestId string `json:"request_id"`
	RetentionUntil string `json:"retention_until"`
	RuntimeInvocationId string `json:"runtime_invocation_id"`
	SnapshotNo int `json:"snapshot_no"`
	Status string `json:"status"`
	Strategy string `json:"strategy"`
	TenantId string `json:"tenant_id"`
	TraceId string `json:"trace_id"`
	TruncationReason string `json:"truncation_reason"`
	TurnId string `json:"turn_id"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
}
