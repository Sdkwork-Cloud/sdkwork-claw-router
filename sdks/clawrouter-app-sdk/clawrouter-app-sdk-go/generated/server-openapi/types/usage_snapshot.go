package types

// Usage snapshot schema exposed by Claw Router.
type UsageSnapshot struct {
	CachedTokens int `json:"cachedTokens"`
	InputTokens int `json:"inputTokens"`
	OutputTokens int `json:"outputTokens"`
	TotalTokens int `json:"totalTokens"`
}
