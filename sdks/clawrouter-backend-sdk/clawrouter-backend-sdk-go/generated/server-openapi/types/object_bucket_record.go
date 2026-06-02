package types

// Object bucket record schema exposed by Claw Router.
type ObjectBucketRecord struct {
	BucketName string `json:"bucket_name"`
	BucketRegion string `json:"bucket_region"`
	CreatedAt string `json:"created_at"`
	DataResidencyRegion string `json:"data_residency_region"`
	DataScope string `json:"data_scope"`
	DefaultEncryptionMode string `json:"default_encryption_mode"`
	DefaultStorageClass string `json:"default_storage_class"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	Id string `json:"id"`
	IdempotencyKey string `json:"idempotency_key"`
	KmsKeyRef string `json:"kms_key_ref"`
	LifecycleEnabled bool `json:"lifecycle_enabled"`
	LogicalScope string `json:"logical_scope"`
	Metadata map[string]JsonValue `json:"metadata"`
	ObjectKeyPrefix string `json:"object_key_prefix"`
	ObjectLockEnabled bool `json:"object_lock_enabled"`
	OrganizationId string `json:"organization_id"`
	ProviderId string `json:"provider_id"`
	PublicAccessBlocked bool `json:"public_access_blocked"`
	RequestId string `json:"request_id"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
	VersioningEnabled bool `json:"versioning_enabled"`
}
