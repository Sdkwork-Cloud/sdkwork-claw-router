package types

// Apps templates publish result schema exposed by Claw Router.
type AppsTemplatesPublishResult struct {
	Code string `json:"code"`
	Data AdminAppTemplateMutationResponse `json:"data"`
	Msg string `json:"msg"`
}
