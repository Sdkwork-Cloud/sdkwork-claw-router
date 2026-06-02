package types

// Media resource record schema exposed by Claw Router.
type MediaResourceRecord struct {
	AccessJson map[string]JsonValue `json:"access_json"`
	AiJson map[string]JsonValue `json:"ai_json"`
	AltText string `json:"alt_text"`
	BucketId string `json:"bucket_id"`
	ChecksumJson map[string]JsonValue `json:"checksum_json"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	DurationSeconds string `json:"duration_seconds"`
	FileName string `json:"file_name"`
	Height int `json:"height"`
	Id string `json:"id"`
	Kind string `json:"kind"`
	MediaResourceNo string `json:"media_resource_no"`
	Metadata map[string]JsonValue `json:"metadata"`
	MimeType string `json:"mime_type"`
	ObjectBlobId string `json:"object_blob_id"`
	ObjectKey string `json:"object_key"`
	ObjectVersion string `json:"object_version"`
	OrganizationId string `json:"organization_id"`
	OwnerId string `json:"owner_id"`
	OwnerType string `json:"owner_type"`
	RenditionsJson map[string]JsonValue `json:"renditions_json"`
	SizeBytes string `json:"size_bytes"`
	Source string `json:"source"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	Title string `json:"title"`
	UpdatedAt string `json:"updated_at"`
	Uri string `json:"uri"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
	Width int `json:"width"`
}
