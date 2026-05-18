package types

// Ai agent run record schema exposed by Claw Router.
type AiAgentRunRecord struct {
	AgentId string `json:"agent_id"`
	AgentVersionId string `json:"agent_version_id"`
	AudioSeconds string `json:"audio_seconds"`
	CachedTokens string `json:"cached_tokens"`
	CancelledAt string `json:"cancelled_at"`
	CompletedAt string `json:"completed_at"`
	CompletionTokens string `json:"completion_tokens"`
	CreatedAt string `json:"created_at"`
	ErrorMessageMasked string `json:"error_message_masked"`
	ExecutionMode string `json:"execution_mode"`
	FailedAt string `json:"failed_at"`
	Id string `json:"id"`
	ImageCount string `json:"image_count"`
	InputMessage string `json:"input_message"`
	LegalHold bool `json:"legal_hold"`
	Metadata map[string]JsonValue `json:"metadata"`
	MeteringStatus string `json:"metering_status"`
	OrganizationId string `json:"organization_id"`
	OutputMessage string `json:"output_message"`
	PayloadHash string `json:"payload_hash"`
	PlannerModel string `json:"planner_model"`
	PromptTokens string `json:"prompt_tokens"`
	RequestId string `json:"request_id"`
	RetentionUntil string `json:"retention_until"`
	RunStatus string `json:"run_status"`
	RunUuid string `json:"run_uuid"`
	SourceSurface string `json:"source_surface"`
	StartedAt string `json:"started_at"`
	Status string `json:"status"`
	TargetModality string `json:"target_modality"`
	TenantId string `json:"tenant_id"`
	TotalSteps int `json:"total_steps"`
	TotalTokens string `json:"total_tokens"`
	TraceId string `json:"trace_id"`
	UsageFactId string `json:"usage_fact_id"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
	VideoSeconds string `json:"video_seconds"`
}
