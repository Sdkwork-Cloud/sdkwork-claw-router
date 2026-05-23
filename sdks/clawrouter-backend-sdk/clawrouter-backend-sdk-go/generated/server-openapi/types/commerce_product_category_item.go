package types

// Commerce product category item schema exposed by Claw Router.
type CommerceProductCategoryItem struct {
	CategoryNo string `json:"categoryNo"`
	CreatedAt string `json:"createdAt"`
	Id string `json:"id"`
	LevelNo int `json:"levelNo"`
	Name string `json:"name"`
	ParentId string `json:"parentId"`
	Path string `json:"path"`
	SortOrder int `json:"sortOrder"`
	Status string `json:"status"`
	UpdatedAt string `json:"updatedAt"`
}
