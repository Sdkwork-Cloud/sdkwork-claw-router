package types

// Commerce product sku attribute record schema exposed by Claw Router.
type CommerceProductSkuAttributeRecord struct {
	AttributeId string `json:"attribute_id"`
	AttributeValueId string `json:"attribute_value_id"`
	CreatedAt string `json:"created_at"`
	CustomValue string `json:"custom_value"`
	OrganizationId string `json:"organization_id"`
	SkuId string `json:"sku_id"`
	TenantId string `json:"tenant_id"`
	UpdatedAt string `json:"updated_at"`
}
