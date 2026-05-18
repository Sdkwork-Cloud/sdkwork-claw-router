package types

// Generation agent usage summary schema exposed by Claw Router.
type GenerationAgentUsageSummary struct {
	CachedTokens int `json:"cachedTokens"`
	CompletionTokens int `json:"completionTokens"`
	Events []GenerationAgentMeteringEvent `json:"events"`
	ImageCount int `json:"imageCount"`
	PromptTokens int `json:"promptTokens"`
	TotalTokens int `json:"totalTokens"`
	VideoSeconds string `json:"videoSeconds"`
}
