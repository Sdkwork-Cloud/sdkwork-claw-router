package types

// Ai memory entry record schema exposed by Claw Router.
type AiMemoryEntryRecord struct {
	ConfidenceScore string `json:"confidence_score"`
	ContentJson map[string]JsonValue `json:"content_json"`
	ContentText string `json:"content_text"`
	CreatedAt string `json:"created_at"`
	CreatedBy string `json:"created_by"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	ExpiresAt string `json:"expires_at"`
	Id string `json:"id"`
	ImportanceScore string `json:"importance_score"`
	LastRecalledAt string `json:"last_recalled_at"`
	MemoryCode string `json:"memory_code"`
	MemoryType string `json:"memory_type"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	OwnerId string `json:"owner_id"`
	OwnerType string `json:"owner_type"`
	RecallCount string `json:"recall_count"`
	SensitivityLevel string `json:"sensitivity_level"`
	SourceConversationId string `json:"source_conversation_id"`
	SourceInvocationId string `json:"source_invocation_id"`
	SourceItemId string `json:"source_item_id"`
	SourceKind string `json:"source_kind"`
	SourceTurnId string `json:"source_turn_id"`
	SpaceId string `json:"space_id"`
	Status string `json:"status"`
	SubjectKey string `json:"subject_key"`
	SubjectType string `json:"subject_type"`
	SupersedesMemoryId string `json:"supersedes_memory_id"`
	TenantId string `json:"tenant_id"`
	TrustLevel string `json:"trust_level"`
	UpdatedAt string `json:"updated_at"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
	ValidFrom string `json:"valid_from"`
	ValidUntil string `json:"valid_until"`
	Version string `json:"version"`
	VersionNo string `json:"version_no"`
}
