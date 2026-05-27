package types

// Commerce product attribute record schema exposed by Claw Router.
type CommerceProductAttributeRecord struct {
	AttributeNo string `json:"attribute_no"`
	CreatedAt string `json:"created_at"`
	Filterable bool `json:"filterable"`
	Name string `json:"name"`
	OrganizationId string `json:"organization_id"`
	Required bool `json:"required"`
	Scope string `json:"scope"`
	Searchable bool `json:"searchable"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	ValueType string `json:"value_type"`
}
