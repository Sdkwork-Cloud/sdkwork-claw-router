package types

// Agent session create request schema exposed by Claw Router.
type AgentSessionCreateRequest struct {
	AgentVersionId string `json:"agentVersionId"`
	ApprovalPolicy string `json:"approvalPolicy"`
	ChatConversationId string `json:"chatConversationId"`
	Cwd string `json:"cwd"`
	DefaultModel string `json:"defaultModel"`
	MemorySpaceId string `json:"memorySpaceId"`
	Metadata map[string]JsonValue `json:"metadata"`
	PermissionMode string `json:"permissionMode"`
	Runtime string `json:"runtime"`
	SandboxPolicy string `json:"sandboxPolicy"`
	SessionKind string `json:"sessionKind"`
	SourceSurface string `json:"sourceSurface"`
	Title string `json:"title"`
}
