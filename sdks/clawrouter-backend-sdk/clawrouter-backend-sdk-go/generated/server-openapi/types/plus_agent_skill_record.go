package types

// Plus agent skill record schema exposed by Claw Router.
type PlusAgentSkillRecord struct {
	Builtin bool `json:"builtin"`
	Capabilities map[string]JsonValue `json:"capabilities"`
	CategoryId string `json:"category_id"`
	ConfigSchema map[string]JsonValue `json:"config_schema"`
	Cover MediaResource `json:"cover"`
	CreatedAt string `json:"created_at"`
	Currency string `json:"currency"`
	DataScope int `json:"data_scope"`
	DefaultConfig map[string]JsonValue `json:"default_config"`
	Description string `json:"description"`
	DocumentationUrl string `json:"documentation_url"`
	Enabled bool `json:"enabled"`
	Entrypoint string `json:"entrypoint"`
	Featured bool `json:"featured"`
	HomepageUrl string `json:"homepage_url"`
	Icon MediaResource `json:"icon"`
	Id string `json:"id"`
	InstallCount string `json:"install_count"`
	IsBuiltin bool `json:"is_builtin"`
	LatestPublishedAt string `json:"latest_published_at"`
	LicenseName string `json:"license_name"`
	ManifestUrl string `json:"manifest_url"`
	MarketStatus string `json:"market_status"`
	Name string `json:"name"`
	OrganizationId string `json:"organization_id"`
	PackageId string `json:"package_id"`
	Price string `json:"price"`
	Provider string `json:"provider"`
	RatingAvg string `json:"rating_avg"`
	RatingCount string `json:"rating_count"`
	RecommendWeight int `json:"recommend_weight"`
	RepositoryUrl string `json:"repository_url"`
	ReviewComment string `json:"review_comment"`
	ReviewStatus string `json:"review_status"`
	ReviewedAt string `json:"reviewed_at"`
	ReviewedBy string `json:"reviewed_by"`
	Runtime string `json:"runtime"`
	SkillKey string `json:"skill_key"`
	SourceType string `json:"source_type"`
	Summary string `json:"summary"`
	Tags map[string]JsonValue `json:"tags"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
	V string `json:"v"`
	Version string `json:"version"`
	VersionName string `json:"version_name"`
	Visibility string `json:"visibility"`
}
