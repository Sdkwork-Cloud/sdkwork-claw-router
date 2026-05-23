package types

// Users list result schema exposed by Claw Router.
type UsersListResult struct {
	Code string `json:"code"`
	Data AdminUsersResponse `json:"data"`
	Msg string `json:"msg"`
}
