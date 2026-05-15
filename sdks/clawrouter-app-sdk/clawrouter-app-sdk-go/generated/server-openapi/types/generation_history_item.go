package types

// Generation history item schema exposed by Claw Router.
type GenerationHistoryItem struct {
	CreatedAt string `json:"createdAt"`
	Date string `json:"date"`
	Id string `json:"id"`
	Images []string `json:"images"`
	ModelInfo string `json:"modelInfo"`
	Prompt string `json:"prompt"`
	Status string `json:"status"`
	Type string `json:"type"`
	UpdatedAt string `json:"updatedAt"`
	Url string `json:"url"`
	Videos []GenerationHistoryMediaItem `json:"videos"`
}
