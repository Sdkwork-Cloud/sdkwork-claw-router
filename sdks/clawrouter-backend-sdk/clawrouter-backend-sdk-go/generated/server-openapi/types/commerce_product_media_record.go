package types

// Commerce product media record schema exposed by Claw Router.
type CommerceProductMediaRecord struct {
	AltText string `json:"alt_text"`
	CreatedAt string `json:"created_at"`
	Id string `json:"id"`
	MediaResourceId string `json:"media_resource_id"`
	MediaRole string `json:"media_role"`
	ObjectBlobId string `json:"object_blob_id"`
	OrganizationId string `json:"organization_id"`
	OwnerId string `json:"owner_id"`
	OwnerType string `json:"owner_type"`
	ResourceSnapshot map[string]JsonValue `json:"resource_snapshot"`
	SortOrder string `json:"sort_order"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
}
