package types

// Agent run step item schema exposed by Claw Router.
type AgentRunStepItem struct {
	CachedTokens string `json:"cachedTokens"`
	CompletedAt string `json:"completedAt"`
	CreatedAt string `json:"createdAt"`
	Id string `json:"id"`
	InputTokens string `json:"inputTokens"`
	LatencyMs string `json:"latencyMs"`
	Model string `json:"model"`
	OutputTokens string `json:"outputTokens"`
	RunId string `json:"runId"`
	RuntimeInvocationId string `json:"runtimeInvocationId"`
	StartedAt string `json:"startedAt"`
	Status string `json:"status"`
	StepIndex string `json:"stepIndex"`
	StepType string `json:"stepType"`
	Title string `json:"title"`
	ToolName string `json:"toolName"`
	TotalTokens string `json:"totalTokens"`
}
