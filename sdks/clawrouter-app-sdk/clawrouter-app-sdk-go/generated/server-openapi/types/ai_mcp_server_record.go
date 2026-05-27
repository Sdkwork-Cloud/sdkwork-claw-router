package types

// Ai mcp server record schema exposed by Claw Router.
type AiMcpServerRecord struct {
	CategoryCode string `json:"category_code"`
	CategoryId string `json:"category_id"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	DeprecatedAt string `json:"deprecated_at"`
	Description string `json:"description"`
	Id string `json:"id"`
	LastCheckedAt string `json:"last_checked_at"`
	LastErrorMasked string `json:"last_error_masked"`
	LatestRevisionId string `json:"latest_revision_id"`
	Metadata map[string]JsonValue `json:"metadata"`
	Name string `json:"name"`
	OrganizationId string `json:"organization_id"`
	OwnerUserId string `json:"owner_user_id"`
	PublishedAt string `json:"published_at"`
	PublishedRevisionId string `json:"published_revision_id"`
	ServerKey string `json:"server_key"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	Transport string `json:"transport"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
	Visibility string `json:"visibility"`
}
