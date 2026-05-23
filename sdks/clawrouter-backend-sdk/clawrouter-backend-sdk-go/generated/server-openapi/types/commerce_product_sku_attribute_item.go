package types

// Commerce product sku attribute item schema exposed by Claw Router.
type CommerceProductSkuAttributeItem struct {
	AttributeId string `json:"attributeId"`
	AttributeName string `json:"attributeName"`
	AttributeValueId string `json:"attributeValueId"`
	CustomValue string `json:"customValue"`
	DisplayValue string `json:"displayValue"`
	ValueCode string `json:"valueCode"`
}
