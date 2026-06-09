package types

// Iam position assignment item schema exposed by Claw Router.
type IamPositionAssignmentItem struct {
	CreatedAt string `json:"createdAt"`
	DepartmentAssignmentId string `json:"departmentAssignmentId"`
	EffectiveFrom string `json:"effectiveFrom"`
	EffectiveTo string `json:"effectiveTo"`
	Id string `json:"id"`
	IsPrimary bool `json:"isPrimary"`
	OrganizationId string `json:"organizationId"`
	PositionId string `json:"positionId"`
	Status string `json:"status"`
	TenantId string `json:"tenantId"`
	UpdatedAt string `json:"updatedAt"`
	UserId string `json:"userId"`
}
