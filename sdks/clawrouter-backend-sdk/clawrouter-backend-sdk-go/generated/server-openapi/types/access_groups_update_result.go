package types

// Access groups update result schema exposed by Claw Router.
type AccessGroupsUpdateResult struct {
	Code string `json:"code"`
	Data AdminAccessGroupMutationResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
