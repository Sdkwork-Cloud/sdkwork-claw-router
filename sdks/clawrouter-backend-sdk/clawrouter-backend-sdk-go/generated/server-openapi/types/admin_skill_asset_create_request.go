package types

// Admin skill asset create request schema exposed by Claw Router.
type AdminSkillAssetCreateRequest struct {
	AltText string `json:"altText"`
	ArtifactId string `json:"artifactId"`
	AssetType int `json:"assetType"`
	AssetUrl string `json:"assetUrl"`
	DurationSeconds string `json:"durationSeconds"`
	FileSize int `json:"fileSize"`
	Height int `json:"height"`
	MimeType string `json:"mimeType"`
	PublishedAt string `json:"publishedAt"`
	SortOrder int `json:"sortOrder"`
	Status int `json:"status"`
	ThumbnailUrl string `json:"thumbnailUrl"`
	Title string `json:"title"`
	Width int `json:"width"`
}
