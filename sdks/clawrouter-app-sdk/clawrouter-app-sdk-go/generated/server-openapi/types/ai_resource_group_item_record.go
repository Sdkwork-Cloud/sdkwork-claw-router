package types

// Ai resource group item record schema exposed by Claw Router.
type AiResourceGroupItemRecord struct {
	ChildResourceGroupCode string `json:"child_resource_group_code"`
	ChildResourceGroupId string `json:"child_resource_group_id"`
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	Id string `json:"id"`
	ItemRole string `json:"item_role"`
	ItemType string `json:"item_type"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	ResourceCode string `json:"resource_code"`
	ResourceGroupCode string `json:"resource_group_code"`
	ResourceGroupId string `json:"resource_group_id"`
	ResourceId string `json:"resource_id"`
	SortOrder int `json:"sort_order"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}
