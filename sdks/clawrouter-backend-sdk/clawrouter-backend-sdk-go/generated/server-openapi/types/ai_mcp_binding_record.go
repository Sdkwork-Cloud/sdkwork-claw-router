package types

// Ai mcp binding record schema exposed by Claw Router.
type AiMcpBindingRecord struct {
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	Id string `json:"id"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	OwnerId string `json:"owner_id"`
	OwnerType string `json:"owner_type"`
	ServerId string `json:"server_id"`
	ServerRevisionId string `json:"server_revision_id"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	ToolId string `json:"tool_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}
