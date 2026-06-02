package types

// Storage reconciliation run record schema exposed by Claw Router.
type StorageReconciliationRunRecord struct {
	BucketId string `json:"bucket_id"`
	CheckMode string `json:"check_mode"`
	ChecksumMismatchCount string `json:"checksum_mismatch_count"`
	CompletedAt string `json:"completed_at"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	DryRun bool `json:"dry_run"`
	Id string `json:"id"`
	IdempotencyKey string `json:"idempotency_key"`
	Metadata map[string]JsonValue `json:"metadata"`
	MissingObjectCount string `json:"missing_object_count"`
	OrganizationId string `json:"organization_id"`
	OrphanObjectCount string `json:"orphan_object_count"`
	ProviderId string `json:"provider_id"`
	RequestId string `json:"request_id"`
	RequestedBy string `json:"requested_by"`
	RunType string `json:"run_type"`
	ScannedObjectCount string `json:"scanned_object_count"`
	StartedAt string `json:"started_at"`
	Status string `json:"status"`
	SummaryJson map[string]JsonValue `json:"summary_json"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}
