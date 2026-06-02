package types

// Ai channel group member record schema exposed by Claw Router.
type AiChannelGroupMemberRecord struct {
	ChannelGroupId string `json:"channel_group_id"`
	ChannelId string `json:"channel_id"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	EffectiveFrom string `json:"effective_from"`
	EffectiveTo string `json:"effective_to"`
	Enabled bool `json:"enabled"`
	Id string `json:"id"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	Priority int `json:"priority"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
	Weight int `json:"weight"`
}
