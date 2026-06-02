package types

// Studio app template record schema exposed by Claw Router.
type StudioAppTemplateRecord struct {
	AppConfigSchema map[string]JsonValue `json:"app_config_schema"`
	CapabilityManifest map[string]JsonValue `json:"capability_manifest"`
	CategoryCode string `json:"category_code"`
	CategoryId string `json:"category_id"`
	Cover MediaResource `json:"cover"`
	CreatedAt string `json:"created_at"`
	CurrentVersionId string `json:"current_version_id"`
	DataScope string `json:"data_scope"`
	DefaultAppConfig map[string]JsonValue `json:"default_app_config"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	DependencyManifest map[string]JsonValue `json:"dependency_manifest"`
	DeprecatedAt string `json:"deprecated_at"`
	Description string `json:"description"`
	Featured bool `json:"featured"`
	Framework string `json:"framework"`
	GitRef string `json:"git_ref"`
	GitRepoUrl string `json:"git_repo_url"`
	GitSubPath string `json:"git_sub_path"`
	Icon MediaResource `json:"icon"`
	Id string `json:"id"`
	Language string `json:"language"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	OwnerUserId string `json:"owner_user_id"`
	PublishStatus string `json:"publish_status"`
	PublishedAt string `json:"published_at"`
	Runtime string `json:"runtime"`
	SortWeight int `json:"sort_weight"`
	SourceAppId string `json:"source_app_id"`
	Status string `json:"status"`
	TemplateCode string `json:"template_code"`
	TemplateName string `json:"template_name"`
	TemplateNo string `json:"template_no"`
	TemplateType string `json:"template_type"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	VariableSchema map[string]JsonValue `json:"variable_schema"`
	Version string `json:"version"`
	Visibility string `json:"visibility"`
}
