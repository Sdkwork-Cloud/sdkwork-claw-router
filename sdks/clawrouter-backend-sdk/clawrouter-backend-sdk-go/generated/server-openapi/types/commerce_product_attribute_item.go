package types

// Commerce product attribute item schema exposed by Claw Router.
type CommerceProductAttributeItem struct {
	AttributeNo string `json:"attributeNo"`
	Filterable bool `json:"filterable"`
	Id string `json:"id"`
	Name string `json:"name"`
	Required bool `json:"required"`
	Scope string `json:"scope"`
	Searchable bool `json:"searchable"`
	Status string `json:"status"`
	ValueType string `json:"valueType"`
}
