package types

// Upload completion attempt record schema exposed by Claw Router.
type UploadCompletionAttemptRecord struct {
	AttemptNo int `json:"attempt_no"`
	CompletionStatus string `json:"completion_status"`
	CreatedAt string `json:"created_at"`
	ErrorCode string `json:"error_code"`
	ErrorMessageMasked string `json:"error_message_masked"`
	Id string `json:"id"`
	LegalHold bool `json:"legal_hold"`
	Metadata map[string]JsonValue `json:"metadata"`
	ObjectBlobId string `json:"object_blob_id"`
	OrganizationId string `json:"organization_id"`
	PayloadHash string `json:"payload_hash"`
	ProviderRequestId string `json:"provider_request_id"`
	RequestId string `json:"request_id"`
	RetentionUntil string `json:"retention_until"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	TraceId string `json:"trace_id"`
	UploadSessionId string `json:"upload_session_id"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
}
