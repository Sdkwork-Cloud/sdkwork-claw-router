package types

// Iam position item schema exposed by Claw Router.
type IamPositionItem struct {
	Code string `json:"code"`
	CreatedAt string `json:"createdAt"`
	DepartmentId string `json:"departmentId"`
	Id string `json:"id"`
	Name string `json:"name"`
	OrganizationId string `json:"organizationId"`
	PositionKind string `json:"positionKind"`
	RankLevel string `json:"rankLevel"`
	Status string `json:"status"`
	TenantId string `json:"tenantId"`
	UpdatedAt string `json:"updatedAt"`
}
