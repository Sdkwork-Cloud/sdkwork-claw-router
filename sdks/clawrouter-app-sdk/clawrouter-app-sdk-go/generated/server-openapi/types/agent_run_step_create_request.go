package types

// Agent run step create request schema exposed by Claw Router.
type AgentRunStepCreateRequest struct {
	InputJson map[string]JsonValue `json:"inputJson"`
	Metadata map[string]JsonValue `json:"metadata"`
	Model string `json:"model"`
	OutputJson map[string]JsonValue `json:"outputJson"`
	RuntimeInvocationId string `json:"runtimeInvocationId"`
	Status string `json:"status"`
	StepType string `json:"stepType"`
	Title string `json:"title"`
	ToolName string `json:"toolName"`
	UsageJson UsageSnapshot `json:"usageJson"`
}
