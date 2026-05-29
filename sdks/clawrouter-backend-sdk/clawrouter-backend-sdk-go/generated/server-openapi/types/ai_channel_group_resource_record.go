package types

// Ai channel group resource record schema exposed by Claw Router.
type AiChannelGroupResourceRecord struct {
	ChannelGroupId string `json:"channel_group_id"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	EffectiveFrom string `json:"effective_from"`
	EffectiveTo string `json:"effective_to"`
	Id string `json:"id"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	ResourceCode string `json:"resource_code"`
	ResourceGroupCode string `json:"resource_group_code"`
	ResourceGroupId string `json:"resource_group_id"`
	ResourceId string `json:"resource_id"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}
