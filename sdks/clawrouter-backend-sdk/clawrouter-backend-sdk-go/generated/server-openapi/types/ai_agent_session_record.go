package types

// Ai agent session record schema exposed by Claw Router.
type AiAgentSessionRecord struct {
	AgentId string `json:"agent_id"`
	AgentVersionId string `json:"agent_version_id"`
	ApprovalPolicy string `json:"approval_policy"`
	ChatConversationId string `json:"chat_conversation_id"`
	CreatedAt string `json:"created_at"`
	Cwd string `json:"cwd"`
	DataScope string `json:"data_scope"`
	DefaultModel string `json:"default_model"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	ExecutionMode string `json:"execution_mode"`
	ForkedFromRunId string `json:"forked_from_run_id"`
	ForkedFromStepId string `json:"forked_from_step_id"`
	GitBranch string `json:"git_branch"`
	GitCommit string `json:"git_commit"`
	Id string `json:"id"`
	LastActiveAt string `json:"last_active_at"`
	LastRunId string `json:"last_run_id"`
	LastStepId string `json:"last_step_id"`
	MemorySpaceId string `json:"memory_space_id"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	OwnerId string `json:"owner_id"`
	OwnerType string `json:"owner_type"`
	ParentSessionId string `json:"parent_session_id"`
	PermissionMode string `json:"permission_mode"`
	ProviderConversationId string `json:"provider_conversation_id"`
	ProviderSessionId string `json:"provider_session_id"`
	RepositoryId string `json:"repository_id"`
	ResumeStrategy string `json:"resume_strategy"`
	RunCount string `json:"run_count"`
	Runtime string `json:"runtime"`
	RuntimeStateStorageKey string `json:"runtime_state_storage_key"`
	SandboxPolicy string `json:"sandbox_policy"`
	SessionCode string `json:"session_code"`
	SessionKind string `json:"session_kind"`
	SourceSurface string `json:"source_surface"`
	Status string `json:"status"`
	StepCount string `json:"step_count"`
	Summary string `json:"summary"`
	TenantId string `json:"tenant_id"`
	Title string `json:"title"`
	ToolCallCount string `json:"tool_call_count"`
	UpdatedAt string `json:"updated_at"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
	Visibility string `json:"visibility"`
	WorkspaceId string `json:"workspace_id"`
}
