package types

// Agent session item schema exposed by Claw Router.
type AgentSessionItem struct {
	AgentId string `json:"agentId"`
	AgentVersionId string `json:"agentVersionId"`
	ApprovalPolicy string `json:"approvalPolicy"`
	ChatConversationId string `json:"chatConversationId"`
	CreatedAt string `json:"createdAt"`
	Cwd string `json:"cwd"`
	DefaultModel string `json:"defaultModel"`
	Id string `json:"id"`
	LastActiveAt string `json:"lastActiveAt"`
	LastRunId string `json:"lastRunId"`
	LastStepId int `json:"lastStepId"`
	MemorySpaceId string `json:"memorySpaceId"`
	PermissionMode string `json:"permissionMode"`
	RunCount int `json:"runCount"`
	Runtime string `json:"runtime"`
	SandboxPolicy string `json:"sandboxPolicy"`
	SessionKind string `json:"sessionKind"`
	SourceSurface string `json:"sourceSurface"`
	Status string `json:"status"`
	StepCount int `json:"stepCount"`
	Title string `json:"title"`
	ToolCallCount int `json:"toolCallCount"`
	UpdatedAt string `json:"updatedAt"`
}
