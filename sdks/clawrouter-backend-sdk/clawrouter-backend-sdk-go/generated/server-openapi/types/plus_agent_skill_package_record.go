package types

// Plus agent skill package record schema exposed by Claw Router.
type PlusAgentSkillPackageRecord struct {
	CategoryId string `json:"category_id"`
	Cover MediaResource `json:"cover"`
	CreatedAt string `json:"created_at"`
	DataScope int `json:"data_scope"`
	Description string `json:"description"`
	Enabled bool `json:"enabled"`
	Featured bool `json:"featured"`
	Icon MediaResource `json:"icon"`
	Id string `json:"id"`
	LatestPublishedAt string `json:"latest_published_at"`
	Name string `json:"name"`
	OrganizationId string `json:"organization_id"`
	PackageKey string `json:"package_key"`
	SortWeight int `json:"sort_weight"`
	Summary string `json:"summary"`
	Tags map[string]JsonValue `json:"tags"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
	V string `json:"v"`
}
