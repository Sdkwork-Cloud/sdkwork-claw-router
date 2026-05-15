package types

// Users create result schema exposed by Claw Router.
type UsersCreateResult struct {
	Code string `json:"code"`
	Data AdminUserMutationResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
