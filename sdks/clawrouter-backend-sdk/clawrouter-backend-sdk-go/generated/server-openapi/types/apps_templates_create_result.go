package types

// Apps templates create result schema exposed by Claw Router.
type AppsTemplatesCreateResult struct {
	Code string `json:"code"`
	Data AdminAppTemplateMutationResponse `json:"data"`
	Msg string `json:"msg"`
}
