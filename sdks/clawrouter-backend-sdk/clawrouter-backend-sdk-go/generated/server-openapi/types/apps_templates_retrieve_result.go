package types

// Apps templates retrieve result schema exposed by Claw Router.
type AppsTemplatesRetrieveResult struct {
	Code string `json:"code"`
	Data AdminAppTemplateMutationResponse `json:"data"`
	Msg string `json:"msg"`
}
