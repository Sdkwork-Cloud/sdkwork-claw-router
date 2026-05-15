package types

// Ai rate limit bucket record schema exposed by Claw Router.
type AiRateLimitBucketRecord struct {
	BucketKey string `json:"bucket_key"`
	CreatedAt string `json:"created_at"`
	CurrentCount string `json:"current_count"`
	CurrentTokens string `json:"current_tokens"`
	Id string `json:"id"`
	LastRequestAt string `json:"last_request_at"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	QuotaPolicyId string `json:"quota_policy_id"`
	RebuildVersion string `json:"rebuild_version"`
	RemainingCount string `json:"remaining_count"`
	RemainingTokens string `json:"remaining_tokens"`
	SourceId string `json:"source_id"`
	SourceType string `json:"source_type"`
	SourceVersion string `json:"source_version"`
	Status string `json:"status"`
	SubjectId string `json:"subject_id"`
	SubjectType string `json:"subject_type"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	WindowEnd string `json:"window_end"`
	WindowStart string `json:"window_start"`
}
