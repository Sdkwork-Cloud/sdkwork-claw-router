package types

// Admin app category update request schema exposed by Claw Router.
type AdminAppCategoryUpdateRequest struct {
	Code string `json:"code"`
	Description string `json:"description"`
	Icon string `json:"icon"`
	Name string `json:"name"`
	ParentId string `json:"parentId"`
	Path string `json:"path"`
	SortWeight int `json:"sortWeight"`
	Status int `json:"status"`
	Visible bool `json:"visible"`
}
