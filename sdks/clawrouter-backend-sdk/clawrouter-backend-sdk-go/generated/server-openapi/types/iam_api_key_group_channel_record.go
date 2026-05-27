package types

// Iam api key group channel record schema exposed by Claw Router.
type IamApiKeyGroupChannelRecord struct {
	Capabilities map[string]JsonValue `json:"capabilities"`
	ChannelId string `json:"channel_id"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	EffectiveFrom string `json:"effective_from"`
	EffectiveTo string `json:"effective_to"`
	GroupId string `json:"group_id"`
	Id string `json:"id"`
	Metadata map[string]JsonValue `json:"metadata"`
	ModelScope map[string]JsonValue `json:"model_scope"`
	OrganizationId string `json:"organization_id"`
	Priority int `json:"priority"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
	Weight int `json:"weight"`
}
