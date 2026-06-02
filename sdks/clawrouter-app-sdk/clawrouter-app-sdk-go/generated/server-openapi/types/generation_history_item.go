package types

// Generation history item schema exposed by Claw Router.
type GenerationHistoryItem struct {
	AspectRatio string `json:"aspectRatio"`
	Asset MediaResource `json:"asset"`
	CreatedAt string `json:"createdAt"`
	Date string `json:"date"`
	DurationSeconds int `json:"durationSeconds"`
	Id string `json:"id"`
	Images []MediaResource `json:"images"`
	ModelCatalogKey string `json:"modelCatalogKey"`
	ModelInfo string `json:"modelInfo"`
	OutputText string `json:"outputText"`
	Prompt string `json:"prompt"`
	Status string `json:"status"`
	Type string `json:"type"`
	UpdatedAt string `json:"updatedAt"`
	Videos []MediaResource `json:"videos"`
}
