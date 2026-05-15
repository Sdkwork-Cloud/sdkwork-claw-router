package types

// Apps create result schema exposed by Claw Router.
type AppsCreateResult struct {
	Code string `json:"code"`
	Data AdminAppMutationResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
