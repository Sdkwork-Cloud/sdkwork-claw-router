package types

// Ai prompt record schema exposed by Claw Router.
type AiPromptRecord struct {
	CategoryCode string `json:"category_code"`
	CategoryId string `json:"category_id"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	DeprecatedAt string `json:"deprecated_at"`
	Description string `json:"description"`
	Id string `json:"id"`
	LatestVersionId string `json:"latest_version_id"`
	Metadata map[string]JsonValue `json:"metadata"`
	Name string `json:"name"`
	OrganizationId string `json:"organization_id"`
	OwnerUserId string `json:"owner_user_id"`
	PromptKey string `json:"prompt_key"`
	PromptType string `json:"prompt_type"`
	PublishedAt string `json:"published_at"`
	PublishedVersionId string `json:"published_version_id"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
	Visibility string `json:"visibility"`
}
