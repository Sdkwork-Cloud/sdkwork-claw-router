package types

// Ai agent tool binding record schema exposed by Claw Router.
type AiAgentToolBindingRecord struct {
	AgentId string `json:"agent_id"`
	AgentVersionId string `json:"agent_version_id"`
	BindingKey string `json:"binding_key"`
	BindingType string `json:"binding_type"`
	CreatedAt string `json:"created_at"`
	CredentialRef string `json:"credential_ref"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	Enabled bool `json:"enabled"`
	HealthStatus string `json:"health_status"`
	Id string `json:"id"`
	LastCheckedAt string `json:"last_checked_at"`
	McpServerId string `json:"mcp_server_id"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	PermissionPolicy map[string]JsonValue `json:"permission_policy"`
	RuntimeConfig map[string]JsonValue `json:"runtime_config"`
	SkillId string `json:"skill_id"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	ToolName string `json:"tool_name"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}
