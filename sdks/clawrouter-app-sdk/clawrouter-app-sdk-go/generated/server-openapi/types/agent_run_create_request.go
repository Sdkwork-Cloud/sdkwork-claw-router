package types

// Agent run create request schema exposed by Claw Router.
type AgentRunCreateRequest struct {
	AgentId string `json:"agentId"`
	AgentVersionId string `json:"agentVersionId"`
	ExecutionMode string `json:"executionMode"`
	InputMessage string `json:"inputMessage"`
	MemorySpaceId string `json:"memorySpaceId"`
	Metadata map[string]JsonValue `json:"metadata"`
	Model string `json:"model"`
	Runtime string `json:"runtime"`
	SourceSurface string `json:"sourceSurface"`
	TraceId string `json:"traceId"`
}
