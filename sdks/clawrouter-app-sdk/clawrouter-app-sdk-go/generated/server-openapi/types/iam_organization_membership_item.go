package types

// Iam organization membership item schema exposed by Claw Router.
type IamOrganizationMembershipItem struct {
	Id string `json:"id"`
	JoinedAt string `json:"joinedAt"`
	LeftAt string `json:"leftAt"`
	OrganizationId string `json:"organizationId"`
	Remark string `json:"remark"`
	RoleCode string `json:"roleCode"`
	Status string `json:"status"`
	TenantId string `json:"tenantId"`
	UserId string `json:"userId"`
}
