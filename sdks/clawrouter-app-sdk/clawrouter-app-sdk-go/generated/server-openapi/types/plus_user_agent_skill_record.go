package types

// Plus user agent skill record schema exposed by Claw Router.
type PlusUserAgentSkillRecord struct {
	Config map[string]JsonValue `json:"config"`
	CreatedAt string `json:"created_at"`
	DataScope int `json:"data_scope"`
	Enabled bool `json:"enabled"`
	Id string `json:"id"`
	InstalledAt string `json:"installed_at"`
	LastEnabledAt string `json:"last_enabled_at"`
	LastUsedAt string `json:"last_used_at"`
	OrganizationId string `json:"organization_id"`
	SkillId string `json:"skill_id"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	UsedCount string `json:"used_count"`
	UserId string `json:"user_id"`
	Uuid string `json:"uuid"`
	V string `json:"v"`
}
