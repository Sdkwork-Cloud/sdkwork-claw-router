package types

// Ai memory space record schema exposed by Claw Router.
type AiMemorySpaceRecord struct {
	AutoExtractEnabled bool `json:"auto_extract_enabled"`
	AutoRecallEnabled bool `json:"auto_recall_enabled"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	EntryCount string `json:"entry_count"`
	Id string `json:"id"`
	MaxInjectedTokens string `json:"max_injected_tokens"`
	MemoryEnabled bool `json:"memory_enabled"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	OwnerId string `json:"owner_id"`
	OwnerType string `json:"owner_type"`
	RetentionPolicy map[string]JsonValue `json:"retention_policy"`
	ReviewRequired bool `json:"review_required"`
	SensitivityPolicy map[string]JsonValue `json:"sensitivity_policy"`
	SpaceType string `json:"space_type"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	Title string `json:"title"`
	UpdatedAt string `json:"updated_at"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}
