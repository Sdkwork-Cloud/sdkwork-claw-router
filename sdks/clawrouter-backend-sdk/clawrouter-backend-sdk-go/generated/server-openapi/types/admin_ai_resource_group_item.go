package types

// Admin ai resource group item schema exposed by Claw Router.
type AdminAiResourceGroupItem struct {
	Description string `json:"description"`
	Dynamic bool `json:"dynamic"`
	GroupCode string `json:"groupCode"`
	GroupName string `json:"groupName"`
	GroupType string `json:"groupType"`
	Id string `json:"id"`
	ResourceCount int `json:"resourceCount"`
	SelectionMode string `json:"selectionMode"`
	SortOrder int `json:"sortOrder"`
	Status string `json:"status"`
}
