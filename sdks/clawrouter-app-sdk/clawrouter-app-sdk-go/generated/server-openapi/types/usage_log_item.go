package types

// Usage log item schema exposed by Claw Router.
type UsageLogItem struct {
	BaseInputPrice string `json:"baseInputPrice"`
	BaseOutputPrice string `json:"baseOutputPrice"`
	CacheReadPrice string `json:"cacheReadPrice"`
	CacheReadTokens int `json:"cacheReadTokens"`
	Cost string `json:"cost"`
	Group string `json:"group"`
	Id string `json:"id"`
	InputTokens int `json:"inputTokens"`
	Ip string `json:"ip"`
	IsStream bool `json:"isStream"`
	Model string `json:"model"`
	Multiplier string `json:"multiplier"`
	OutputTokens int `json:"outputTokens"`
	Path string `json:"path"`
	ReasoningEffort string `json:"reasoningEffort"`
	RequestId string `json:"requestId"`
	Time string `json:"time"`
	TokenName string `json:"tokenName"`
	TotalTime string `json:"totalTime"`
	Ttft string `json:"ttft"`
	Type string `json:"type"`
}
