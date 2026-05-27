package types

// Upload part record schema exposed by Claw Router.
type UploadPartRecord struct {
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	Id string `json:"id"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	PartEtag string `json:"part_etag"`
	PartNumber int `json:"part_number"`
	PartSha256 string `json:"part_sha256"`
	PresignedUrlExpiresAt string `json:"presigned_url_expires_at"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	UploadSessionId string `json:"upload_session_id"`
	UploadedAt string `json:"uploaded_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}
