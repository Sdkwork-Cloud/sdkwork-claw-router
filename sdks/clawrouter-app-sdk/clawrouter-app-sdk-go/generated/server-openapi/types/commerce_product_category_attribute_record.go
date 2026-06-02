package types

// Commerce product category attribute record schema exposed by Claw Router.
type CommerceProductCategoryAttributeRecord struct {
	AttributeId string `json:"attribute_id"`
	CategoryId string `json:"category_id"`
	CreatedAt string `json:"created_at"`
	Filterable bool `json:"filterable"`
	Id string `json:"id"`
	OrganizationId string `json:"organization_id"`
	Required bool `json:"required"`
	Searchable bool `json:"searchable"`
	SortOrder string `json:"sort_order"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
}
