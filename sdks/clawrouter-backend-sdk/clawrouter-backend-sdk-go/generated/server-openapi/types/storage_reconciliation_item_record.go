package types

// Storage reconciliation item record schema exposed by Claw Router.
type StorageReconciliationItemRecord struct {
	ActualHash string `json:"actual_hash"`
	ActualSizeBytes string `json:"actual_size_bytes"`
	BucketId string `json:"bucket_id"`
	CreatedAt string `json:"created_at"`
	ExpectedHash string `json:"expected_hash"`
	ExpectedSizeBytes string `json:"expected_size_bytes"`
	Id string `json:"id"`
	IssueType string `json:"issue_type"`
	LegalHold bool `json:"legal_hold"`
	Metadata map[string]JsonValue `json:"metadata"`
	ObjectBlobId string `json:"object_blob_id"`
	ObjectKey string `json:"object_key"`
	OrganizationId string `json:"organization_id"`
	PayloadHash string `json:"payload_hash"`
	RepairPayload map[string]JsonValue `json:"repair_payload"`
	RepairStatus string `json:"repair_status"`
	RequestId string `json:"request_id"`
	RetentionUntil string `json:"retention_until"`
	RunId string `json:"run_id"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	TraceId string `json:"trace_id"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
}
