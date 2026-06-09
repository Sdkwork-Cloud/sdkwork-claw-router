package types

// Iam organization tree item schema exposed by Claw Router.
type IamOrganizationTreeItem struct {
	Children []map[string]JsonValue `json:"children"`
	Code string `json:"code"`
	CreatedAt string `json:"createdAt"`
	Id string `json:"id"`
	Name string `json:"name"`
	ParentId string `json:"parentId"`
	Path string `json:"path"`
	Status string `json:"status"`
	TenantId string `json:"tenantId"`
	UpdatedAt string `json:"updatedAt"`
}
