package types

// Storage default bucket policy record schema exposed by Claw Router.
type StorageDefaultBucketPolicyRecord struct {
	BucketId string `json:"bucket_id"`
	BucketLogicalScope string `json:"bucket_logical_scope"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	Id string `json:"id"`
	LogicalScope string `json:"logical_scope"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	Reason string `json:"reason"`
	RequestId string `json:"request_id"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	UpdatedBy string `json:"updated_by"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}
