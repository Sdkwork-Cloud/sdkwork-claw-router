package types

// Ai mcp tool record schema exposed by Claw Router.
type AiMcpToolRecord struct {
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	Description string `json:"description"`
	DiscoveredAt string `json:"discovered_at"`
	Enabled bool `json:"enabled"`
	Id string `json:"id"`
	InputSchema map[string]JsonValue `json:"input_schema"`
	LastInvokedAt string `json:"last_invoked_at"`
	Metadata map[string]JsonValue `json:"metadata"`
	Name string `json:"name"`
	OrganizationId string `json:"organization_id"`
	OutputSchema map[string]JsonValue `json:"output_schema"`
	RateLimitPolicy map[string]JsonValue `json:"rate_limit_policy"`
	RequiresApproval bool `json:"requires_approval"`
	RiskLevel string `json:"risk_level"`
	SchemaHash string `json:"schema_hash"`
	ServerId string `json:"server_id"`
	ServerRevisionId string `json:"server_revision_id"`
	SortWeight int `json:"sort_weight"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	ToolKey string `json:"tool_key"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}
