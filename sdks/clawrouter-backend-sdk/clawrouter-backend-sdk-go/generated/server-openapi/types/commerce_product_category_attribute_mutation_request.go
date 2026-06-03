package types

// Commerce product category attribute mutation request schema exposed by Claw Router.
type CommerceProductCategoryAttributeMutationRequest struct {
	AttributeId string `json:"attributeId"`
	CategoryId string `json:"categoryId"`
	Filterable bool `json:"filterable"`
	Required bool `json:"required"`
	Searchable bool `json:"searchable"`
	SortOrder int `json:"sortOrder"`
	Status string `json:"status"`
}
