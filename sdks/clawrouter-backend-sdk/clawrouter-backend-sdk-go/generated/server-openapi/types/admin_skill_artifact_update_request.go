package types

// Admin skill artifact update request schema exposed by Claw Router.
type AdminSkillArtifactUpdateRequest struct {
	Artifact MediaResource `json:"artifact"`
	ArtifactRef string `json:"artifactRef"`
	ArtifactSizeBytes int `json:"artifactSizeBytes"`
	ArtifactType int `json:"artifactType"`
	ChecksumHash string `json:"checksumHash"`
	DeprecatedAt string `json:"deprecatedAt"`
	Frameworks []string `json:"frameworks"`
	LicenseName string `json:"licenseName"`
	OsName string `json:"osName"`
	PlatformType string `json:"platformType"`
	PublishedAt string `json:"publishedAt"`
	ReleaseNotes string `json:"releaseNotes"`
	Runtime string `json:"runtime"`
	Status int `json:"status"`
	Version string `json:"version"`
}
