package types

// Storage quota policy record schema exposed by Claw Router.
type StorageQuotaPolicyRecord struct {
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	Enforcement string `json:"enforcement"`
	Id string `json:"id"`
	IdempotencyKey string `json:"idempotency_key"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	QuotaLimitBytes string `json:"quota_limit_bytes"`
	RequestId string `json:"request_id"`
	ScopeId string `json:"scope_id"`
	ScopeType string `json:"scope_type"`
	SingleFileLimitBytes string `json:"single_file_limit_bytes"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}
