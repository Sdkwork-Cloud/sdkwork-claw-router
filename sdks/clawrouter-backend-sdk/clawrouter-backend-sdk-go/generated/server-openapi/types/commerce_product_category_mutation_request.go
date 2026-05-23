package types

// Commerce product category mutation request schema exposed by Claw Router.
type CommerceProductCategoryMutationRequest struct {
	CategoryNo string `json:"categoryNo"`
	Name string `json:"name"`
	ParentId string `json:"parentId"`
	SortOrder int `json:"sortOrder"`
	Status string `json:"status"`
}
