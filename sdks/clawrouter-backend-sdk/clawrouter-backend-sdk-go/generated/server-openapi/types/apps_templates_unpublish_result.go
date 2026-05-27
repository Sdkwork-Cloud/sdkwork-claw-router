package types

// Apps templates unpublish result schema exposed by Claw Router.
type AppsTemplatesUnpublishResult struct {
	Code string `json:"code"`
	Data AdminAppTemplateMutationResponse `json:"data"`
	Msg string `json:"msg"`
}
