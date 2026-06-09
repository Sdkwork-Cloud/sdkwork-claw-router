package types

// Iam department tree item schema exposed by Claw Router.
type IamDepartmentTreeItem struct {
	Children []map[string]JsonValue `json:"children"`
	Code string `json:"code"`
	CreatedAt string `json:"createdAt"`
	Id string `json:"id"`
	Name string `json:"name"`
	OrganizationId string `json:"organizationId"`
	ParentDepartmentId string `json:"parentDepartmentId"`
	Path string `json:"path"`
	Status string `json:"status"`
	TenantId string `json:"tenantId"`
	UpdatedAt string `json:"updatedAt"`
}
