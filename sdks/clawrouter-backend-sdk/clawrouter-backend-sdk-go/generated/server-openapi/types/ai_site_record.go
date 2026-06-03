package types

// Ai site record schema exposed by Claw Router.
type AiSiteRecord struct {
	BaseUrl string `json:"base_url"`
	ColorToken string `json:"color_token"`
	ConsecutiveErrorCount string `json:"consecutive_error_count"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	Description string `json:"description"`
	DisplayName string `json:"display_name"`
	DocsUrl string `json:"docs_url"`
	Environment string `json:"environment"`
	HealthStatus string `json:"health_status"`
	Id string `json:"id"`
	LastCheckedAt string `json:"last_checked_at"`
	LastLatencyMs int `json:"last_latency_ms"`
	LastSyncAt string `json:"last_sync_at"`
	Logo MediaResource `json:"logo"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	OwnerKind string `json:"owner_kind"`
	RegionCode string `json:"region_code"`
	SiteCode string `json:"site_code"`
	SiteName string `json:"site_name"`
	SiteType string `json:"site_type"`
	SortOrder int `json:"sort_order"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
	WebsiteUrl string `json:"website_url"`
}
