package types

// Upload presign grant record schema exposed by Claw Router.
type UploadPresignGrantRecord struct {
	BucketId string `json:"bucket_id"`
	CanonicalHeaders map[string]JsonValue `json:"canonical_headers"`
	ConsumedAt string `json:"consumed_at"`
	CreatedAt string `json:"created_at"`
	ExpiresAt string `json:"expires_at"`
	Id string `json:"id"`
	LegalHold bool `json:"legal_hold"`
	Metadata map[string]JsonValue `json:"metadata"`
	Method string `json:"method"`
	ObjectKey string `json:"object_key"`
	OrganizationId string `json:"organization_id"`
	PayloadHash string `json:"payload_hash"`
	ProviderId string `json:"provider_id"`
	RequestId string `json:"request_id"`
	RetentionUntil string `json:"retention_until"`
	SignedHeaders map[string]JsonValue `json:"signed_headers"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	TraceId string `json:"trace_id"`
	UploadPartId string `json:"upload_part_id"`
	UploadSessionId string `json:"upload_session_id"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
}
