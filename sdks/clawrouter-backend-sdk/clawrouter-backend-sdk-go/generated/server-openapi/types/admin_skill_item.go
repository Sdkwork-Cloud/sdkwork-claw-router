package types

// Offline agent skill snapshot returned by the backend.
type AdminSkillItem struct {
	Builtin bool `json:"builtin"`
	Capabilities []string `json:"capabilities"`
	CategoryId string `json:"categoryId"`
	ConfigSchema map[string]JsonValue `json:"configSchema"`
	CoverImage string `json:"coverImage"`
	CreatedAt string `json:"createdAt"`
	Currency string `json:"currency"`
	DefaultConfig map[string]JsonValue `json:"defaultConfig"`
	Description string `json:"description"`
	DocumentationUrl string `json:"documentationUrl"`
	Enabled bool `json:"enabled"`
	Entrypoint string `json:"entrypoint"`
	Featured bool `json:"featured"`
	HomepageUrl string `json:"homepageUrl"`
	Icon string `json:"icon"`
	Id string `json:"id"`
	InstallCount string `json:"installCount"`
	IsBuiltin bool `json:"isBuiltin"`
	LatestPublishedAt string `json:"latestPublishedAt"`
	LicenseName string `json:"licenseName"`
	ManifestUrl string `json:"manifestUrl"`
	MarketStatus string `json:"marketStatus"`
	Name string `json:"name"`
	PackageId string `json:"packageId"`
	Price string `json:"price"`
	Provider string `json:"provider"`
	RatingAvg string `json:"ratingAvg"`
	RatingCount string `json:"ratingCount"`
	RecommendWeight int `json:"recommendWeight"`
	RepositoryUrl string `json:"repositoryUrl"`
	ReviewComment string `json:"reviewComment"`
	ReviewStatus string `json:"reviewStatus"`
	ReviewedAt string `json:"reviewedAt"`
	ReviewedBy string `json:"reviewedBy"`
	Runtime string `json:"runtime"`
	SkillKey string `json:"skillKey"`
	SourceType string `json:"sourceType"`
	Summary string `json:"summary"`
	Tags []string `json:"tags"`
	UpdatedAt string `json:"updatedAt"`
	Version string `json:"version"`
	VersionName string `json:"versionName"`
	Visibility string `json:"visibility"`
}
