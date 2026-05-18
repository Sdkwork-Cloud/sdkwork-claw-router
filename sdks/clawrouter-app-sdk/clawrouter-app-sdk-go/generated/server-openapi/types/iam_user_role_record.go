package types

// Iam user role record schema exposed by Claw Router.
type IamUserRoleRecord struct {
	CreatedAt string `json:"created_at"`
	Id string `json:"id"`
	OrganizationId string `json:"organization_id"`
	RoleId string `json:"role_id"`
	TenantId string `json:"tenant_id"`
	UserId string `json:"user_id"`
}
