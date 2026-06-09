package types

// Organizations list result schema exposed by Claw Router.
type OrganizationsListResult struct {
	Code string `json:"code"`
	Data IamOrganizationListResponse `json:"data"`
	Msg string `json:"msg"`
}
