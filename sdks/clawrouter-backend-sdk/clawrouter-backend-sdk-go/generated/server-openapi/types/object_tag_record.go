package types

// Object tag record schema exposed by Claw Router.
type ObjectTagRecord struct {
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	Id string `json:"id"`
	Metadata map[string]JsonValue `json:"metadata"`
	ObjectBlobId string `json:"object_blob_id"`
	OrganizationId string `json:"organization_id"`
	Status string `json:"status"`
	TagKey string `json:"tag_key"`
	TagValue string `json:"tag_value"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}
