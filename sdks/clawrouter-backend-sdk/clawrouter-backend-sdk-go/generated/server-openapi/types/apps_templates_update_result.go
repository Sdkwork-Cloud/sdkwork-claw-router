package types

// Apps templates update result schema exposed by Claw Router.
type AppsTemplatesUpdateResult struct {
	Code string `json:"code"`
	Data AdminAppTemplateMutationResponse `json:"data"`
	Msg string `json:"msg"`
}
