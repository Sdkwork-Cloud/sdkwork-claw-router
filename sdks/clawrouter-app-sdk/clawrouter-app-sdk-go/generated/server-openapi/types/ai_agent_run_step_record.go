package types

// Ai agent run step record schema exposed by Claw Router.
type AiAgentRunStepRecord struct {
	AgentId string `json:"agent_id"`
	AgentVersionId string `json:"agent_version_id"`
	AudioSeconds string `json:"audio_seconds"`
	CachedTokens string `json:"cached_tokens"`
	CompletedAt string `json:"completed_at"`
	CompletionTokens string `json:"completion_tokens"`
	CreatedAt string `json:"created_at"`
	ErrorMessageMasked string `json:"error_message_masked"`
	Id string `json:"id"`
	ImageCount string `json:"image_count"`
	InputSnapshot map[string]JsonValue `json:"input_snapshot"`
	LatencyMs int `json:"latency_ms"`
	LegalHold bool `json:"legal_hold"`
	McpServerId string `json:"mcp_server_id"`
	Metadata map[string]JsonValue `json:"metadata"`
	Model string `json:"model"`
	OrganizationId string `json:"organization_id"`
	OutputSnapshot map[string]JsonValue `json:"output_snapshot"`
	PayloadHash string `json:"payload_hash"`
	PromptTokens string `json:"prompt_tokens"`
	RequestId string `json:"request_id"`
	RetentionUntil string `json:"retention_until"`
	RunId string `json:"run_id"`
	RuntimeInvocationId string `json:"runtime_invocation_id"`
	SkillId string `json:"skill_id"`
	StartedAt string `json:"started_at"`
	Status string `json:"status"`
	StepIndex int `json:"step_index"`
	StepStatus string `json:"step_status"`
	StepType string `json:"step_type"`
	TenantId string `json:"tenant_id"`
	Title string `json:"title"`
	ToolBindingId string `json:"tool_binding_id"`
	ToolName string `json:"tool_name"`
	TotalTokens string `json:"total_tokens"`
	TraceId string `json:"trace_id"`
	UsageFactId string `json:"usage_fact_id"`
	UsageJson map[string]JsonValue `json:"usage_json"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
	VideoSeconds string `json:"video_seconds"`
}
