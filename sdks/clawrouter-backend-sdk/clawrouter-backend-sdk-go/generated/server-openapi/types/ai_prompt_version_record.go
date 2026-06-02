package types

// Ai prompt version record schema exposed by Claw Router.
type AiPromptVersionRecord struct {
	ChecksumHash string `json:"checksum_hash"`
	Content string `json:"content"`
	CreatedAt string `json:"created_at"`
	CreatedBy string `json:"created_by"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	DeprecatedAt string `json:"deprecated_at"`
	ExamplesJson map[string]JsonValue `json:"examples_json"`
	Id string `json:"id"`
	LifecycleStatus string `json:"lifecycle_status"`
	Metadata map[string]JsonValue `json:"metadata"`
	ModelConstraints map[string]JsonValue `json:"model_constraints"`
	OrganizationId string `json:"organization_id"`
	OutputSchema map[string]JsonValue `json:"output_schema"`
	PromptId string `json:"prompt_id"`
	PublishedAt string `json:"published_at"`
	ReviewComment string `json:"review_comment"`
	ReviewStatus string `json:"review_status"`
	SafetyPolicy map[string]JsonValue `json:"safety_policy"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	Title string `json:"title"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	VariableSchema map[string]JsonValue `json:"variable_schema"`
	Version string `json:"version"`
	VersionNo string `json:"version_no"`
}
