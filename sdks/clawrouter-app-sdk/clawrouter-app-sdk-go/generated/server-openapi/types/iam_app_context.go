package types

// Iam app context schema exposed by Claw Router.
type IamAppContext struct {
	AppId string `json:"appId"`
	AuthLevel string `json:"authLevel"`
	DataScope []string `json:"dataScope"`
	DeploymentMode string `json:"deploymentMode"`
	Environment string `json:"environment"`
	OrganizationId string `json:"organizationId"`
	PermissionScope []string `json:"permissionScope"`
	SessionId string `json:"sessionId"`
	TenantId string `json:"tenantId"`
	UserId string `json:"userId"`
}
