package types

// Ai runtime invocation record schema exposed by Claw Router.
type AiRuntimeInvocationRecord struct {
	AgentRunId string `json:"agent_run_id"`
	AgentRunStepId string `json:"agent_run_step_id"`
	AgentSessionId string `json:"agent_session_id"`
	ApprovalPolicy string `json:"approval_policy"`
	AttemptNo int `json:"attempt_no"`
	ChatItemId string `json:"chat_item_id"`
	ChatTurnId string `json:"chat_turn_id"`
	CompletedAt string `json:"completed_at"`
	ConversationId string `json:"conversation_id"`
	CreatedAt string `json:"created_at"`
	Cwd string `json:"cwd"`
	Endpoint string `json:"endpoint"`
	ErrorCode string `json:"error_code"`
	ErrorMessageMasked string `json:"error_message_masked"`
	ErrorType string `json:"error_type"`
	ExitCode string `json:"exit_code"`
	FinishReason string `json:"finish_reason"`
	Id string `json:"id"`
	InvocationNo string `json:"invocation_no"`
	InvocationType string `json:"invocation_type"`
	LatencyMs string `json:"latency_ms"`
	LegalHold bool `json:"legal_hold"`
	Metadata map[string]JsonValue `json:"metadata"`
	Model string `json:"model"`
	OrganizationId string `json:"organization_id"`
	PayloadHash string `json:"payload_hash"`
	PermissionMode string `json:"permission_mode"`
	Provider string `json:"provider"`
	ProviderConversationId string `json:"provider_conversation_id"`
	ProviderResponseId string `json:"provider_response_id"`
	ProviderSessionId string `json:"provider_session_id"`
	ProviderStepId string `json:"provider_step_id"`
	RequestId string `json:"request_id"`
	RequestJson map[string]JsonValue `json:"request_json"`
	ResponseJson map[string]JsonValue `json:"response_json"`
	RetentionUntil string `json:"retention_until"`
	Runtime string `json:"runtime"`
	SandboxPolicy string `json:"sandbox_policy"`
	StartedAt string `json:"started_at"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	ToolCallId string `json:"tool_call_id"`
	ToolName string `json:"tool_name"`
	TraceId string `json:"trace_id"`
	TtftMs string `json:"ttft_ms"`
	UsageJson map[string]JsonValue `json:"usage_json"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
}
