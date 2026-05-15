package types

// Apps enable result schema exposed by Claw Router.
type AppsEnableResult struct {
	Code string `json:"code"`
	Data AdminAppMutationResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
