package types

// Ai chat conversation record schema exposed by Claw Router.
type AiChatConversationRecord struct {
	AgentId string `json:"agent_id"`
	AgentSessionId string `json:"agent_session_id"`
	CachedTokenTotal string `json:"cached_token_total"`
	ConversationCode string `json:"conversation_code"`
	CostAmountTotal string `json:"cost_amount_total"`
	CreatedAt string `json:"created_at"`
	Currency string `json:"currency"`
	DataScope string `json:"data_scope"`
	DefaultEndpoint string `json:"default_endpoint"`
	DefaultModel string `json:"default_model"`
	DefaultProvider string `json:"default_provider"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	Id string `json:"id"`
	InputTokenTotal string `json:"input_token_total"`
	ItemCount string `json:"item_count"`
	LastItemId string `json:"last_item_id"`
	LastMessagePreview string `json:"last_message_preview"`
	LastTurnId string `json:"last_turn_id"`
	MemorySpaceId string `json:"memory_space_id"`
	MessageCount string `json:"message_count"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	OutputTokenTotal string `json:"output_token_total"`
	OwnerId string `json:"owner_id"`
	OwnerType string `json:"owner_type"`
	ReasoningTokenTotal string `json:"reasoning_token_total"`
	SourceSurface string `json:"source_surface"`
	Status string `json:"status"`
	Summary string `json:"summary"`
	TenantId string `json:"tenant_id"`
	Title string `json:"title"`
	TurnCount string `json:"turn_count"`
	UpdatedAt string `json:"updated_at"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
	Visibility string `json:"visibility"`
}
