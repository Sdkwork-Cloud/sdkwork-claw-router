package types

// Ai chat message record schema exposed by Claw Router.
type AiChatMessageRecord struct {
	ContentJson map[string]JsonValue `json:"content_json"`
	ContentText string `json:"content_text"`
	ConversationId string `json:"conversation_id"`
	CreatedAt string `json:"created_at"`
	Direction string `json:"direction"`
	FinishReason string `json:"finish_reason"`
	Id string `json:"id"`
	ItemId string `json:"item_id"`
	LegalHold bool `json:"legal_hold"`
	MessageKind string `json:"message_kind"`
	MessageNo string `json:"message_no"`
	Metadata map[string]JsonValue `json:"metadata"`
	Model string `json:"model"`
	OrganizationId string `json:"organization_id"`
	PayloadHash string `json:"payload_hash"`
	Provider string `json:"provider"`
	RawProviderJson map[string]JsonValue `json:"raw_provider_json"`
	RequestId string `json:"request_id"`
	RetentionUntil string `json:"retention_until"`
	Role string `json:"role"`
	Runtime string `json:"runtime"`
	RuntimeInvocationId string `json:"runtime_invocation_id"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	TokenCount string `json:"token_count"`
	TraceId string `json:"trace_id"`
	TurnId string `json:"turn_id"`
	UsageLinkId string `json:"usage_link_id"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
}
