package types

// Updated skill catalog artifact snapshot returned by the backend.
type AdminSkillArtifactItem struct {
	Artifact MediaResource `json:"artifact"`
	ArtifactRef string `json:"artifactRef"`
	ArtifactSizeBytes int `json:"artifactSizeBytes"`
	ArtifactType int `json:"artifactType"`
	ChecksumHash string `json:"checksumHash"`
	CreatedAt string `json:"createdAt"`
	DeprecatedAt string `json:"deprecatedAt"`
	Frameworks []string `json:"frameworks"`
	Id string `json:"id"`
	LicenseName string `json:"licenseName"`
	OsName string `json:"osName"`
	PlatformType string `json:"platformType"`
	PublishedAt string `json:"publishedAt"`
	ReleaseNotes string `json:"releaseNotes"`
	Runtime string `json:"runtime"`
	SkillId string `json:"skillId"`
	Status int `json:"status"`
	TargetId string `json:"targetId"`
	TargetType int `json:"targetType"`
	UpdatedAt string `json:"updatedAt"`
	Version string `json:"version"`
}
