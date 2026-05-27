package types

// Storage gc job record schema exposed by Claw Router.
type StorageGcJobRecord struct {
	CompletedAt string `json:"completed_at"`
	CreatedAt string `json:"created_at"`
	CursorToken string `json:"cursor_token"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	Id string `json:"id"`
	IdempotencyKey string `json:"idempotency_key"`
	JobType string `json:"job_type"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	RequestId string `json:"request_id"`
	RequestedBy string `json:"requested_by"`
	StartedAt string `json:"started_at"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}
