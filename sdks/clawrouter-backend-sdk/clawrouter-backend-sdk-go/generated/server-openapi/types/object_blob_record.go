package types

// Object blob record schema exposed by Claw Router.
type ObjectBlobRecord struct {
	BucketId string `json:"bucket_id"`
	ContentSha256 string `json:"content_sha256"`
	ContentType string `json:"content_type"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	EncryptionMode string `json:"encryption_mode"`
	Id string `json:"id"`
	KmsKeyRef string `json:"kms_key_ref"`
	LastVerifiedAt string `json:"last_verified_at"`
	LegalHold bool `json:"legal_hold"`
	Metadata map[string]JsonValue `json:"metadata"`
	ObjectKey string `json:"object_key"`
	OrganizationId string `json:"organization_id"`
	OriginalFilename string `json:"original_filename"`
	OwnerId string `json:"owner_id"`
	OwnerType string `json:"owner_type"`
	PhysicalSizeBytes string `json:"physical_size_bytes"`
	ProviderId string `json:"provider_id"`
	RetentionUntil string `json:"retention_until"`
	SizeBytes string `json:"size_bytes"`
	Status string `json:"status"`
	StorageClass string `json:"storage_class"`
	StorageEtag string `json:"storage_etag"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
	VersionId string `json:"version_id"`
}
