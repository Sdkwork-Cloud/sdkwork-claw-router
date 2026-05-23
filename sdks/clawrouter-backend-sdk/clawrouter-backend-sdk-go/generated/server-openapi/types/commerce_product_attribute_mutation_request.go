package types

// Commerce product attribute mutation request schema exposed by Claw Router.
type CommerceProductAttributeMutationRequest struct {
	AttributeNo string `json:"attributeNo"`
	Filterable bool `json:"filterable"`
	Name string `json:"name"`
	Required bool `json:"required"`
	Scope string `json:"scope"`
	Searchable bool `json:"searchable"`
	Status string `json:"status"`
	ValueType string `json:"valueType"`
}
