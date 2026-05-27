package types

// Object bucket record schema exposed by Claw Router.
type ObjectBucketRecord struct {
	BucketName string `json:"bucket_name"`
	BucketRegion string `json:"bucket_region"`
	CreatedAt string `json:"created_at"`
	DataResidencyRegion string `json:"data_residency_region"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	Id string `json:"id"`
	IdempotencyKey string `json:"idempotency_key"`
	KmsKeyRef string `json:"kms_key_ref"`
	LogicalScope string `json:"logical_scope"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	ProviderId string `json:"provider_id"`
	RequestId string `json:"request_id"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}
