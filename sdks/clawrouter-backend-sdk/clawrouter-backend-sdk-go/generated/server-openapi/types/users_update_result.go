package types

// Users update result schema exposed by Claw Router.
type UsersUpdateResult struct {
	Code string `json:"code"`
	Data AdminUserMutationResponse `json:"data"`
	Msg string `json:"msg"`
}
