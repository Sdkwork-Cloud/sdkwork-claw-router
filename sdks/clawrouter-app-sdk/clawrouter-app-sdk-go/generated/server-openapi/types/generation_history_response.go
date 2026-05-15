package types

// Generation history response schema exposed by Claw Router.
type GenerationHistoryResponse struct {
	Items []GenerationHistoryItem `json:"items"`
}
