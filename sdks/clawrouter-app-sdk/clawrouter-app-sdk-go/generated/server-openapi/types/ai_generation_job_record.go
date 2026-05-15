package types

// Ai generation job record schema exposed by Claw Router.
type AiGenerationJobRecord struct {
	ChannelId string `json:"channel_id"`
	CompletedAt string `json:"completed_at"`
	CreatedAt string `json:"created_at"`
	FailureCode string `json:"failure_code"`
	FailureMessageMasked string `json:"failure_message_masked"`
	Id string `json:"id"`
	InputAssetIds map[string]JsonValue `json:"input_asset_ids"`
	JobType string `json:"job_type"`
	LegalHold bool `json:"legal_hold"`
	Metadata map[string]JsonValue `json:"metadata"`
	Modality string `json:"modality"`
	Model string `json:"model"`
	NegativePrompt string `json:"negative_prompt"`
	OrganizationId string `json:"organization_id"`
	ParameterSnapshot map[string]JsonValue `json:"parameter_snapshot"`
	PayloadHash string `json:"payload_hash"`
	ProgressPercent int `json:"progress_percent"`
	Prompt string `json:"prompt"`
	ProviderId string `json:"provider_id"`
	RequestId string `json:"request_id"`
	RetentionUntil string `json:"retention_until"`
	SessionId string `json:"session_id"`
	StartedAt string `json:"started_at"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	TraceId string `json:"trace_id"`
	UsageFactId string `json:"usage_fact_id"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
}
