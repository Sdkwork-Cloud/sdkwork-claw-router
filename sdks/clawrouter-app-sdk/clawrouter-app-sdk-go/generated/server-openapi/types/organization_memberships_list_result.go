package types

// Organization memberships list result schema exposed by Claw Router.
type OrganizationMembershipsListResult struct {
	Code string `json:"code"`
	Data IamOrganizationMembershipListResponse `json:"data"`
	Msg string `json:"msg"`
}
