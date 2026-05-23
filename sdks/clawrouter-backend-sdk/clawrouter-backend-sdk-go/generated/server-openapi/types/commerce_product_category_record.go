package types

// Commerce product category record schema exposed by Claw Router.
type CommerceProductCategoryRecord struct {
	CategoryNo string `json:"category_no"`
	CreatedAt string `json:"created_at"`
	Description string `json:"description"`
	IconUrl string `json:"icon_url"`
	LevelNo int `json:"level_no"`
	Name string `json:"name"`
	OrganizationId string `json:"organization_id"`
	ParentId string `json:"parent_id"`
	Path string `json:"path"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
}
