package types

// Plus agent skill record schema exposed by Claw Router.
type PlusAgentSkillRecord struct {
	CategoryId string `json:"category_id"`
	CoverImage string `json:"cover_image"`
	Description string `json:"description"`
	DocumentationUrl string `json:"documentation_url"`
	Entrypoint string `json:"entrypoint"`
	HomepageUrl string `json:"homepage_url"`
	Icon string `json:"icon"`
	LatestPublishedAt string `json:"latest_published_at"`
	LicenseName string `json:"license_name"`
	ManifestUrl string `json:"manifest_url"`
	PackageId string `json:"package_id"`
	Price string `json:"price"`
	Provider string `json:"provider"`
	RepositoryUrl string `json:"repository_url"`
	ReviewComment string `json:"review_comment"`
	ReviewedAt string `json:"reviewed_at"`
	ReviewedBy string `json:"reviewed_by"`
	Runtime string `json:"runtime"`
	Summary string `json:"summary"`
	UserId string `json:"user_id"`
	Version string `json:"version"`
	VersionName string `json:"version_name"`
}
