package types

// Ai agent mcp server record schema exposed by Claw Router.
type AiAgentMcpServerRecord struct {
	ConnectionConfig map[string]JsonValue `json:"connection_config"`
	CreatedAt string `json:"created_at"`
	CredentialRef string `json:"credential_ref"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	Description string `json:"description"`
	HealthStatus string `json:"health_status"`
	Id string `json:"id"`
	LastCheckedAt string `json:"last_checked_at"`
	LastErrorMasked string `json:"last_error_masked"`
	Metadata map[string]JsonValue `json:"metadata"`
	Name string `json:"name"`
	OrganizationId string `json:"organization_id"`
	PermissionPolicy map[string]JsonValue `json:"permission_policy"`
	PromptCatalog map[string]JsonValue `json:"prompt_catalog"`
	ResourceCatalog map[string]JsonValue `json:"resource_catalog"`
	ServerCode string `json:"server_code"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	ToolCatalog map[string]JsonValue `json:"tool_catalog"`
	TransportType string `json:"transport_type"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}
