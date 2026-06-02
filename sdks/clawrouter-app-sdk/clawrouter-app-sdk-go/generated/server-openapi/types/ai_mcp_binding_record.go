package types

// Ai mcp binding record schema exposed by Claw Router.
type AiMcpBindingRecord struct {
	AllowedTools map[string]JsonValue `json:"allowed_tools"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	DeniedTools map[string]JsonValue `json:"denied_tools"`
	Enabled bool `json:"enabled"`
	Id string `json:"id"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	OwnerId string `json:"owner_id"`
	OwnerType string `json:"owner_type"`
	PolicyJson map[string]JsonValue `json:"policy_json"`
	Priority int `json:"priority"`
	ServerId string `json:"server_id"`
	ServerRevisionId string `json:"server_revision_id"`
	SnapshotJson map[string]JsonValue `json:"snapshot_json"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	ToolId string `json:"tool_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}
