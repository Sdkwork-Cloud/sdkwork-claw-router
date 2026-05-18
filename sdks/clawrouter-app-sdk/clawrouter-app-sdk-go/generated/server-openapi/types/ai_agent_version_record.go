package types

// Ai agent version record schema exposed by Claw Router.
type AiAgentVersionRecord struct {
	AgentId string `json:"agent_id"`
	ConfigHash string `json:"config_hash"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	Id string `json:"id"`
	McpPolicy map[string]JsonValue `json:"mcp_policy"`
	MemoryPolicy map[string]JsonValue `json:"memory_policy"`
	Metadata map[string]JsonValue `json:"metadata"`
	ModelPolicy map[string]JsonValue `json:"model_policy"`
	OrganizationId string `json:"organization_id"`
	PublishedAt string `json:"published_at"`
	PublishedBy string `json:"published_by"`
	ReleaseStatus string `json:"release_status"`
	RuntimePolicy map[string]JsonValue `json:"runtime_policy"`
	SkillPolicy map[string]JsonValue `json:"skill_policy"`
	Status string `json:"status"`
	SystemPrompt string `json:"system_prompt"`
	TenantId string `json:"tenant_id"`
	ToolPolicy map[string]JsonValue `json:"tool_policy"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
	VersionNo string `json:"version_no"`
}
