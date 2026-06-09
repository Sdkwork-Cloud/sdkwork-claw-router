package types

// Organizations tree retrieve result schema exposed by Claw Router.
type OrganizationsTreeRetrieveResult struct {
	Code string `json:"code"`
	Data IamOrganizationTreeResponse `json:"data"`
	Msg string `json:"msg"`
}
