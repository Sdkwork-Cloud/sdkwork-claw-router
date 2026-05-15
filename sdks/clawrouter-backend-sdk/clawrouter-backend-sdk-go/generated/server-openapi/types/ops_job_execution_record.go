package types

// Ops job execution record schema exposed by Claw Router.
type OpsJobExecutionRecord struct {
	CreatedAt string `json:"created_at"`
	DurationMs string `json:"duration_ms"`
	EndedAt string `json:"ended_at"`
	ExecutionStatus string `json:"execution_status"`
	FailureCount string `json:"failure_count"`
	FailureReason string `json:"failure_reason"`
	Id string `json:"id"`
	JobName string `json:"job_name"`
	JobType string `json:"job_type"`
	LegalHold bool `json:"legal_hold"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	Payload map[string]JsonValue `json:"payload"`
	PayloadHash string `json:"payload_hash"`
	ProcessedCount string `json:"processed_count"`
	RequestId string `json:"request_id"`
	RetentionUntil string `json:"retention_until"`
	StartedAt string `json:"started_at"`
	Status string `json:"status"`
	SuccessCount string `json:"success_count"`
	TenantId string `json:"tenant_id"`
	TraceId string `json:"trace_id"`
	TriggerType string `json:"trigger_type"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
}
