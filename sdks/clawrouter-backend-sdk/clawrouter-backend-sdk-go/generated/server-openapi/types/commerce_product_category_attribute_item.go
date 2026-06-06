package types

// Commerce product category attribute item schema exposed by Claw Router.
type CommerceProductCategoryAttributeItem struct {
	AttributeId string `json:"attributeId"`
	AttributeName string `json:"attributeName"`
	AttributeNo string `json:"attributeNo"`
	CategoryId string `json:"categoryId"`
	CategoryName string `json:"categoryName"`
	CategoryPath string `json:"categoryPath"`
	CreatedAt string `json:"createdAt"`
	Filterable bool `json:"filterable"`
	Id string `json:"id"`
	Required bool `json:"required"`
	Scope string `json:"scope"`
	Searchable bool `json:"searchable"`
	SortOrder string `json:"sortOrder"`
	Status string `json:"status"`
	UpdatedAt string `json:"updatedAt"`
	ValueType string `json:"valueType"`
}
