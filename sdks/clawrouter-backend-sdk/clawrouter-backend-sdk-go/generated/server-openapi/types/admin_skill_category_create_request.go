package types

// Admin skill category create request schema exposed by Claw Router.
type AdminSkillCategoryCreateRequest struct {
	Code string `json:"code"`
	Description string `json:"description"`
	Icon string `json:"icon"`
	Name string `json:"name"`
	ParentId string `json:"parentId"`
	Path string `json:"path"`
	SortWeight int `json:"sortWeight"`
	Status int `json:"status"`
	Type int `json:"type"`
	Visible bool `json:"visible"`
}
