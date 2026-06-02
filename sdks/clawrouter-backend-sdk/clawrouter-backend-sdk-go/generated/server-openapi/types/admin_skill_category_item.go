package types

// Updated skill category snapshot returned by the backend.
type AdminSkillCategoryItem struct {
	Code string `json:"code"`
	Description string `json:"description"`
	Icon MediaResource `json:"icon"`
	Id string `json:"id"`
	Name string `json:"name"`
	ParentId string `json:"parentId"`
	Path string `json:"path"`
	SortWeight int `json:"sortWeight"`
	Status int `json:"status"`
	Type int `json:"type"`
	Visible bool `json:"visible"`
}
