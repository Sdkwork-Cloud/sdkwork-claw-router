package types

// Storage gc job record schema exposed by Claw Router.
type StorageGcJobRecord struct {
	CandidateCount string `json:"candidate_count"`
	CompletedAt string `json:"completed_at"`
	CreatedAt string `json:"created_at"`
	CriteriaJson map[string]JsonValue `json:"criteria_json"`
	CursorToken string `json:"cursor_token"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	DeletedObjectCount string `json:"deleted_object_count"`
	DryRun bool `json:"dry_run"`
	Id string `json:"id"`
	IdempotencyKey string `json:"idempotency_key"`
	JobType string `json:"job_type"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	ReleasedBytes string `json:"released_bytes"`
	RequestId string `json:"request_id"`
	RequestedBy string `json:"requested_by"`
	ResultJson map[string]JsonValue `json:"result_json"`
	StartedAt string `json:"started_at"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}
