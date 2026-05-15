package types

// Updated skill catalog asset snapshot returned by the backend.
type AdminSkillAssetItem struct {
	AltText string `json:"altText"`
	ArtifactId string `json:"artifactId"`
	AssetType int `json:"assetType"`
	AssetUrl string `json:"assetUrl"`
	CreatedAt string `json:"createdAt"`
	DurationSeconds string `json:"durationSeconds"`
	FileSize int `json:"fileSize"`
	Height int `json:"height"`
	Id string `json:"id"`
	MimeType string `json:"mimeType"`
	PublishedAt string `json:"publishedAt"`
	SkillId string `json:"skillId"`
	SortOrder int `json:"sortOrder"`
	Status int `json:"status"`
	TargetId string `json:"targetId"`
	TargetType int `json:"targetType"`
	ThumbnailUrl string `json:"thumbnailUrl"`
	Title string `json:"title"`
	UpdatedAt string `json:"updatedAt"`
	Width int `json:"width"`
}
