package types

// Apps update result schema exposed by Claw Router.
type AppsUpdateResult struct {
	Code string `json:"code"`
	Data AdminAppMutationResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
