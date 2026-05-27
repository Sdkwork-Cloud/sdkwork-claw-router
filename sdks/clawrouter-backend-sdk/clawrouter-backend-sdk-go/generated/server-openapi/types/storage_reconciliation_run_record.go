package types

// Storage reconciliation run record schema exposed by Claw Router.
type StorageReconciliationRunRecord struct {
	BucketId string `json:"bucket_id"`
	CheckMode string `json:"check_mode"`
	CompletedAt string `json:"completed_at"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	Id string `json:"id"`
	IdempotencyKey string `json:"idempotency_key"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	ProviderId string `json:"provider_id"`
	RequestId string `json:"request_id"`
	RequestedBy string `json:"requested_by"`
	RunType string `json:"run_type"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}
