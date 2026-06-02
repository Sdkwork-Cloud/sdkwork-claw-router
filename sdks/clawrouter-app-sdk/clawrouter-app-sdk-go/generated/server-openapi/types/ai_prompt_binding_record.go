package types

// Ai prompt binding record schema exposed by Claw Router.
type AiPromptBindingRecord struct {
	BindingRole string `json:"binding_role"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	Enabled bool `json:"enabled"`
	Id string `json:"id"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	OwnerId string `json:"owner_id"`
	OwnerType string `json:"owner_type"`
	PolicyJson map[string]JsonValue `json:"policy_json"`
	Priority int `json:"priority"`
	PromptId string `json:"prompt_id"`
	PromptVersionId string `json:"prompt_version_id"`
	SnapshotJson map[string]JsonValue `json:"snapshot_json"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}
