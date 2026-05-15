package types

// Apps disable result schema exposed by Claw Router.
type AppsDisableResult struct {
	Code string `json:"code"`
	Data AdminAppMutationResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
