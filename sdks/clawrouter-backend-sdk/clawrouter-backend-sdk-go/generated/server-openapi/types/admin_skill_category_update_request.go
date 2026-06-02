package types

// Admin skill category update request schema exposed by Claw Router.
type AdminSkillCategoryUpdateRequest struct {
	Code string `json:"code"`
	Description string `json:"description"`
	Icon MediaResource `json:"icon"`
	Name string `json:"name"`
	ParentId string `json:"parentId"`
	Path string `json:"path"`
	SortWeight int `json:"sortWeight"`
	Status int `json:"status"`
	Type int `json:"type"`
	Visible bool `json:"visible"`
}
