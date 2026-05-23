package types

// Agent run item schema exposed by Claw Router.
type AgentRunItem struct {
	AgentId string `json:"agentId"`
	AgentVersionId string `json:"agentVersionId"`
	CachedTokens int `json:"cachedTokens"`
	CompletedAt string `json:"completedAt"`
	CreatedAt string `json:"createdAt"`
	ErrorMessageMasked string `json:"errorMessageMasked"`
	ExecutionMode string `json:"executionMode"`
	Id string `json:"id"`
	InputMessage string `json:"inputMessage"`
	InputTokens int `json:"inputTokens"`
	MemorySpaceId string `json:"memorySpaceId"`
	Model string `json:"model"`
	OutputMessage string `json:"outputMessage"`
	OutputTokens int `json:"outputTokens"`
	RequestId string `json:"requestId"`
	Runtime string `json:"runtime"`
	SessionId string `json:"sessionId"`
	SourceSurface string `json:"sourceSurface"`
	StartedAt string `json:"startedAt"`
	Status string `json:"status"`
	TotalSteps int `json:"totalSteps"`
	TotalTokens int `json:"totalTokens"`
	TraceId string `json:"traceId"`
}
