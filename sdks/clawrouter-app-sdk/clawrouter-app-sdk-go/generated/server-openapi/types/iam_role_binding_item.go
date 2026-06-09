package types

// Iam role binding item schema exposed by Claw Router.
type IamRoleBindingItem struct {
	ConditionJson string `json:"conditionJson"`
	CreatedAt string `json:"createdAt"`
	Effect string `json:"effect"`
	Id string `json:"id"`
	PrincipalId string `json:"principalId"`
	PrincipalKind string `json:"principalKind"`
	RoleId string `json:"roleId"`
	ScopeId string `json:"scopeId"`
	ScopeKind string `json:"scopeKind"`
	Status string `json:"status"`
	TenantId string `json:"tenantId"`
	UpdatedAt string `json:"updatedAt"`
}
