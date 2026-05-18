package types

// Iam organization member record schema exposed by Claw Router.
type IamOrganizationMemberRecord struct {
	Id string `json:"id"`
	JoinedAt string `json:"joined_at"`
	LeftAt string `json:"left_at"`
	OrganizationId string `json:"organization_id"`
	Remark string `json:"remark"`
	RoleCode string `json:"role_code"`
	Status string `json:"status"`
	TenantId string `json:"tenant_id"`
	UserId string `json:"user_id"`
}
