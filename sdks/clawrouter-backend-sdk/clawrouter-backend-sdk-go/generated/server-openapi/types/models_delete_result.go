package types

// Models delete result schema exposed by Claw Router.
type ModelsDeleteResult struct {
	Code string `json:"code"`
	Data AdminDeleteResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
