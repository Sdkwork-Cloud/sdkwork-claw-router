package types

// Ai resource group record schema exposed by Claw Router.
type AiResourceGroupRecord struct {
	CreatedAt string `json:"created_at"`
	DataScope string `json:"data_scope"`
	DeletedAt string `json:"deleted_at"`
	DeletedBy string `json:"deleted_by"`
	Description string `json:"description"`
	GroupCode string `json:"group_code"`
	GroupName string `json:"group_name"`
	GroupType string `json:"group_type"`
	Id string `json:"id"`
	Metadata map[string]JsonValue `json:"metadata"`
	OrganizationId string `json:"organization_id"`
	SelectionMode string `json:"selection_mode"`
	SortOrder int `json:"sort_order"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	Uuid string `json:"uuid"`
	Version string `json:"version"`
}
