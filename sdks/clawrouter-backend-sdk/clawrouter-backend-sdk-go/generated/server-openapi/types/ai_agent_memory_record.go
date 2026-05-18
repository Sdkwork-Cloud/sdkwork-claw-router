package types

// Ai agent memory record schema exposed by Claw Router.
type AiAgentMemoryRecord struct {
	AgentId string `json:"agent_id"`
	ContentRef string `json:"content_ref"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	EmbeddingRef string `json:"embedding_ref"`
	ExpiresAt string `json:"expires_at"`
	Id string `json:"id"`
	LastUsedAt string `json:"last_used_at"`
	MemoryHash string `json:"memory_hash"`
	MemoryScope string `json:"memory_scope"`
	MemoryType string `json:"memory_type"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	OwnerId string `json:"owner_id"`
	OwnerType string `json:"owner_type"`
	OwnerUserId string `json:"owner_user_id"`
	RetentionPolicy map[string]JsonValue `json:"retention_policy"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}
