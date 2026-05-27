package types

// Upload session record schema exposed by Claw Router.
type UploadSessionRecord struct {
	AbortedAt string `json:"aborted_at"`
	BucketId string `json:"bucket_id"`
	CompletedAt string `json:"completed_at"`
	ContentType string `json:"content_type"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	ExpectedSha256 string `json:"expected_sha256"`
	ExpiresAt string `json:"expires_at"`
	Id string `json:"id"`
	IdempotencyKey string `json:"idempotency_key"`
	LogicalScope string `json:"logical_scope"`
	Metadata map[string]JsonValue `json:"metadata"`
	ObjectKey string `json:"object_key"`
	OrganizationId string `json:"organization_id"`
	OriginalFilename string `json:"original_filename"`
	OwnerId string `json:"owner_id"`
	OwnerType string `json:"owner_type"`
	ProviderId string `json:"provider_id"`
	RequestId string `json:"request_id"`
	S3UploadId string `json:"s3_upload_id"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	UploadMode string `json:"upload_mode"`
	UploadSessionNo string `json:"upload_session_no"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}
