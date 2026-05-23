package types

// Ai memory space binding record schema exposed by Claw Router.
type AiMemorySpaceBindingRecord struct {
	BindingId string `json:"binding_id"`
	BindingRole string `json:"binding_role"`
	BindingType string `json:"binding_type"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	Enabled bool `json:"enabled"`
	Id string `json:"id"`
	MemorySpaceId string `json:"memory_space_id"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	Priority int `json:"priority"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}
