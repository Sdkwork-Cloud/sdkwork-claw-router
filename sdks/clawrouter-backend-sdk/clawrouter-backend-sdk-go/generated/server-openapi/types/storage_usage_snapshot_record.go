package types

// Storage usage snapshot record schema exposed by Claw Router.
type StorageUsageSnapshotRecord struct {
	AppId string `json:"app_id"`
	BusinessDomain string `json:"business_domain"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	FileCount string `json:"file_count"`
	Id string `json:"id"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	ReservedBytes string `json:"reserved_bytes"`
	RetainedBytes string `json:"retained_bytes"`
	ScopeId string `json:"scope_id"`
	ScopeType string `json:"scope_type"`
	SnapshotAt string `json:"snapshot_at"`
	SnapshotType string `json:"snapshot_type"`
	SpaceId string `json:"space_id"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	TrashBytes string `json:"trash_bytes"`
	UpdatedAt string `json:"updated_at"`
	UsedLogicalBytes string `json:"used_logical_bytes"`
	UsedPhysicalBytes string `json:"used_physical_bytes"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}
