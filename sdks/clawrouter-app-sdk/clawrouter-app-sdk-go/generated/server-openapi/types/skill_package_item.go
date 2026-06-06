package types

// Skill package item schema exposed by Claw Router.
type SkillPackageItem struct {
	ArtifactRef string `json:"artifactRef"`
	ArtifactSizeBytes string `json:"artifactSizeBytes"`
	Frameworks []string `json:"frameworks"`
	Id string `json:"id"`
	LicenseName string `json:"licenseName"`
	PublishedAt string `json:"publishedAt"`
	Version string `json:"version"`
}
