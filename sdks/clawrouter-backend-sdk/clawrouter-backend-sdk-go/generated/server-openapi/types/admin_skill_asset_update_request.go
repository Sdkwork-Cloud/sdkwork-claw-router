package types

// Admin skill asset update request schema exposed by Claw Router.
type AdminSkillAssetUpdateRequest struct {
	AltText string `json:"altText"`
	ArtifactId string `json:"artifactId"`
	Asset MediaResource `json:"asset"`
	AssetType int `json:"assetType"`
	DurationSeconds string `json:"durationSeconds"`
	FileSize string `json:"fileSize"`
	Height int `json:"height"`
	MimeType string `json:"mimeType"`
	PublishedAt string `json:"publishedAt"`
	SortOrder int `json:"sortOrder"`
	Status int `json:"status"`
	Thumbnail MediaResource `json:"thumbnail"`
	Title string `json:"title"`
	Width int `json:"width"`
}
