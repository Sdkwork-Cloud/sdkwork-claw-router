package types

// Users current retrieve result schema exposed by Claw Router.
type UsersCurrentRetrieveResult struct {
	Code string `json:"code"`
	Data IamUserResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
