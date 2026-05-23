package types

// Agent run step item schema exposed by Claw Router.
type AgentRunStepItem struct {
	CachedTokens int `json:"cachedTokens"`
	CompletedAt string `json:"completedAt"`
	CreatedAt string `json:"createdAt"`
	Id string `json:"id"`
	InputTokens int `json:"inputTokens"`
	LatencyMs int `json:"latencyMs"`
	Model string `json:"model"`
	OutputTokens int `json:"outputTokens"`
	RunId string `json:"runId"`
	RuntimeInvocationId string `json:"runtimeInvocationId"`
	StartedAt string `json:"startedAt"`
	Status string `json:"status"`
	StepIndex int `json:"stepIndex"`
	StepType string `json:"stepType"`
	Title string `json:"title"`
	ToolName string `json:"toolName"`
	TotalTokens int `json:"totalTokens"`
}
