package types

// Usage log item schema exposed by Claw Router.
type UsageLogItem struct {
	BaseInputPrice string `json:"baseInputPrice"`
	BaseOutputPrice string `json:"baseOutputPrice"`
	CacheReadPrice string `json:"cacheReadPrice"`
	CacheReadTokens int `json:"cacheReadTokens"`
	Cost string `json:"cost"`
	ErrorCode string `json:"errorCode"`
	ErrorMessage string `json:"errorMessage"`
	ErrorType string `json:"errorType"`
	Group string `json:"group"`
	HttpStatus int `json:"httpStatus"`
	Id string `json:"id"`
	InputTokens int `json:"inputTokens"`
	Ip string `json:"ip"`
	IsStream bool `json:"isStream"`
	Model string `json:"model"`
	Multiplier string `json:"multiplier"`
	OutputTokens int `json:"outputTokens"`
	Path string `json:"path"`
	ProviderNativeModel string `json:"providerNativeModel"`
	ReasoningEffort string `json:"reasoningEffort"`
	RequestId string `json:"requestId"`
	RequestedModelCatalogKey string `json:"requestedModelCatalogKey"`
	Status string `json:"status"`
	Time string `json:"time"`
	TokenName string `json:"tokenName"`
	TotalTime string `json:"totalTime"`
	Ttft string `json:"ttft"`
	Type string `json:"type"`
}
