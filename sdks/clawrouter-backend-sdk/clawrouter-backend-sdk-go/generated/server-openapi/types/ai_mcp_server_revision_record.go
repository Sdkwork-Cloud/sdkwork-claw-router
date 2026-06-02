package types

// Ai mcp server revision record schema exposed by Claw Router.
type AiMcpServerRevisionRecord struct {
	ArgsJson map[string]JsonValue `json:"args_json"`
	AuthType string `json:"auth_type"`
	Command string `json:"command"`
	ConfigHash string `json:"config_hash"`
	CreatedAt string `json:"created_at"`
	CreatedBy string `json:"created_by"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	DeprecatedAt string `json:"deprecated_at"`
	EndpointUrl string `json:"endpoint_url"`
	EnvSchema map[string]JsonValue `json:"env_schema"`
	Id string `json:"id"`
	LifecycleStatus string `json:"lifecycle_status"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	PublishedAt string `json:"published_at"`
	RetryPolicy map[string]JsonValue `json:"retry_policy"`
	RevisionNo string `json:"revision_no"`
	SecretRef string `json:"secret_ref"`
	ServerId string `json:"server_id"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	TimeoutMs int `json:"timeout_ms"`
	Transport string `json:"transport"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}
