package types

// Generation history item schema exposed by Claw Router.
type GenerationHistoryItem struct {
	AspectRatio string `json:"aspectRatio"`
	CreatedAt string `json:"createdAt"`
	Date string `json:"date"`
	DurationSeconds int `json:"durationSeconds"`
	Id string `json:"id"`
	Images []string `json:"images"`
	ModelCatalogKey string `json:"modelCatalogKey"`
	ModelInfo string `json:"modelInfo"`
	Prompt string `json:"prompt"`
	Status string `json:"status"`
	Type string `json:"type"`
	UpdatedAt string `json:"updatedAt"`
	Url string `json:"url"`
	Videos []GenerationHistoryMediaItem `json:"videos"`
}
