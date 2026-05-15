package types

// Users list result schema exposed by Claw Router.
type UsersListResult struct {
	Code string `json:"code"`
	Data AdminUsersResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
