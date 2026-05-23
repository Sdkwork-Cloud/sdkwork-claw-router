package types

// Ai chat item record schema exposed by Claw Router.
type AiChatItemRecord struct {
	CompletedAt string `json:"completed_at"`
	ContentJson map[string]JsonValue `json:"content_json"`
	ContentText string `json:"content_text"`
	ConversationId string `json:"conversation_id"`
	CreatedAt string `json:"created_at"`
	Direction string `json:"direction"`
	Id string `json:"id"`
	ItemType string `json:"item_type"`
	LegalHold bool `json:"legal_hold"`
	Metadata map[string]JsonValue `json:"metadata"`
	Model string `json:"model"`
	OrganizationId string `json:"organization_id"`
	ParentItemId string `json:"parent_item_id"`
	PayloadHash string `json:"payload_hash"`
	Provider string `json:"provider"`
	ProviderCallId string `json:"provider_call_id"`
	ProviderItemId string `json:"provider_item_id"`
	ProviderResponseId string `json:"provider_response_id"`
	RawProviderJson map[string]JsonValue `json:"raw_provider_json"`
	RequestId string `json:"request_id"`
	RetentionUntil string `json:"retention_until"`
	Role string `json:"role"`
	Runtime string `json:"runtime"`
	RuntimeInvocationId string `json:"runtime_invocation_id"`
	SequenceNo string `json:"sequence_no"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	TraceId string `json:"trace_id"`
	TurnId string `json:"turn_id"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
}
