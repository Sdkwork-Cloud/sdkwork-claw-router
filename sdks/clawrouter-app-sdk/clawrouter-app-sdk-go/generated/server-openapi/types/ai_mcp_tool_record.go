package types

// Ai mcp tool record schema exposed by Claw Router.
type AiMcpToolRecord struct {
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	Description string `json:"description"`
	DiscoveredAt string `json:"discovered_at"`
	Id string `json:"id"`
	LastInvokedAt string `json:"last_invoked_at"`
	Metadata map[string]JsonValue `json:"metadata"`
	Name string `json:"name"`
	OrganizationId string `json:"organization_id"`
	SchemaHash string `json:"schema_hash"`
	ServerId string `json:"server_id"`
	ServerRevisionId string `json:"server_revision_id"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	ToolKey string `json:"tool_key"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}
