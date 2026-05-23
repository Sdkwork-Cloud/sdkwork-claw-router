package types

// Apps publish result schema exposed by Claw Router.
type AppsPublishResult struct {
	Code string `json:"code"`
	Data AdminAppMutationResponse `json:"data"`
	Msg string `json:"msg"`
}
