package types

// Iam department assignment item schema exposed by Claw Router.
type IamDepartmentAssignmentItem struct {
	AssignmentKind string `json:"assignmentKind"`
	CreatedAt string `json:"createdAt"`
	DepartmentId string `json:"departmentId"`
	EffectiveFrom string `json:"effectiveFrom"`
	EffectiveTo string `json:"effectiveTo"`
	Id string `json:"id"`
	IsPrimary bool `json:"isPrimary"`
	OrganizationId string `json:"organizationId"`
	OrganizationMembershipId string `json:"organizationMembershipId"`
	Status string `json:"status"`
	TenantId string `json:"tenantId"`
	UpdatedAt string `json:"updatedAt"`
	UserId string `json:"userId"`
}
