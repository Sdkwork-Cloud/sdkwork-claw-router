package types

// Ai agent record schema exposed by Claw Router.
type AiAgentRecord struct {
	AgentCode string `json:"agent_code"`
	Avatar MediaResource `json:"avatar"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DefaultVersionId string `json:"default_version_id"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	Description string `json:"description"`
	GovernanceStatus string `json:"governance_status"`
	Id string `json:"id"`
	Metadata map[string]JsonValue `json:"metadata"`
	Name string `json:"name"`
	OrganizationId string `json:"organization_id"`
	OwnerUserId string `json:"owner_user_id"`
	PublishedAt string `json:"published_at"`
	PublishedBy string `json:"published_by"`
	Status string `json:"status"`
	TemplateSource string `json:"template_source"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
	Visibility string `json:"visibility"`
}
