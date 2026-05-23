package types

// Access groups create result schema exposed by Claw Router.
type AccessGroupsCreateResult struct {
	Code string `json:"code"`
	Data AdminAccessGroupMutationResponse `json:"data"`
	Msg string `json:"msg"`
}
