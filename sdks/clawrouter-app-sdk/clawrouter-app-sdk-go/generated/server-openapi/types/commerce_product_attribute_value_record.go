package types

// Commerce product attribute value record schema exposed by Claw Router.
type CommerceProductAttributeValueRecord struct {
	AttributeId string `json:"attribute_id"`
	CreatedAt string `json:"created_at"`
	DisplayValue string `json:"display_value"`
	OrganizationId string `json:"organization_id"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
	ValueCode string `json:"value_code"`
}
