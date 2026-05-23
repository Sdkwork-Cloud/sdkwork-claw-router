package types

// Ai memory embedding record schema exposed by Claw Router.
type AiMemoryEmbeddingRecord struct {
	ContentHash string `json:"content_hash"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	EmbeddingDimensions int `json:"embedding_dimensions"`
	EmbeddingModel string `json:"embedding_model"`
	EmbeddingProvider string `json:"embedding_provider"`
	Id string `json:"id"`
	IndexedAt string `json:"indexed_at"`
	MemoryId string `json:"memory_id"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	VectorJson map[string]JsonValue `json:"vector_json"`
	VectorStorageKey string `json:"vector_storage_key"`
	Version string `json:"version"`
}
