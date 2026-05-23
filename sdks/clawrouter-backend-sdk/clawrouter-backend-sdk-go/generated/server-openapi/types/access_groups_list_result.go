package types

// Access groups list result schema exposed by Claw Router.
type AccessGroupsListResult struct {
	Code string `json:"code"`
	Data AdminAccessGroupsResponse `json:"data"`
	Msg string `json:"msg"`
}
