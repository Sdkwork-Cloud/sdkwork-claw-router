package types

// Admin skill create request schema exposed by Claw Router.
type AdminSkillCreateRequest struct {
	Builtin bool `json:"builtin"`
	Capabilities []string `json:"capabilities"`
	CategoryId string `json:"categoryId"`
	ConfigSchema map[string]JsonValue `json:"configSchema"`
	Cover MediaResource `json:"cover"`
	Currency string `json:"currency"`
	DefaultConfig map[string]JsonValue `json:"defaultConfig"`
	Description string `json:"description"`
	DocumentationUrl string `json:"documentationUrl"`
	Enabled bool `json:"enabled"`
	Entrypoint string `json:"entrypoint"`
	Featured bool `json:"featured"`
	HomepageUrl string `json:"homepageUrl"`
	Icon MediaResource `json:"icon"`
	IsBuiltin bool `json:"isBuiltin"`
	LicenseName string `json:"licenseName"`
	ManifestUrl string `json:"manifestUrl"`
	MarketStatus string `json:"marketStatus"`
	Name string `json:"name"`
	PackageId string `json:"packageId"`
	Price string `json:"price"`
	Provider string `json:"provider"`
	RecommendWeight int `json:"recommendWeight"`
	RepositoryUrl string `json:"repositoryUrl"`
	ReviewStatus string `json:"reviewStatus"`
	Runtime string `json:"runtime"`
	SkillKey string `json:"skillKey"`
	SourceType string `json:"sourceType"`
	Summary string `json:"summary"`
	Tags []string `json:"tags"`
	Version string `json:"version"`
	VersionName string `json:"versionName"`
	Visibility string `json:"visibility"`
}
