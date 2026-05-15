package types

// Ai routing profile record schema exposed by Claw Router.
type AiRoutingProfileRecord struct {
	ConfigHash string `json:"config_hash"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	Id string `json:"id"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	PolicyId string `json:"policy_id"`
	ProfileName string `json:"profile_name"`
	ProfileVersion string `json:"profile_version"`
	PublishedAt string `json:"published_at"`
	PublishedBy string `json:"published_by"`
	ReleaseStatus string `json:"release_status"`
	RollbackFromProfileId string `json:"rollback_from_profile_id"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	TrafficPercent string `json:"traffic_percent"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}
