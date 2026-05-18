package types

// Iam role permission record schema exposed by Claw Router.
type IamRolePermissionRecord struct {
	CreatedAt string `json:"created_at"`
	Id string `json:"id"`
	PermissionId string `json:"permission_id"`
	RoleId string `json:"role_id"`
	TenantId string `json:"tenant_id"`
}
