package types

// Storage usage snapshot record schema exposed by Claw Router.
type StorageUsageSnapshotRecord struct {
	AppId string `json:"app_id"`
	BusinessDomain string `json:"business_domain"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	Id string `json:"id"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	ScopeId string `json:"scope_id"`
	ScopeType string `json:"scope_type"`
	SnapshotType string `json:"snapshot_type"`
	SpaceId string `json:"space_id"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}
