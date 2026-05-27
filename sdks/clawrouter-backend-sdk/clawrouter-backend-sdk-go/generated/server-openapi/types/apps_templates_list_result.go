package types

// Apps templates list result schema exposed by Claw Router.
type AppsTemplatesListResult struct {
	Code string `json:"code"`
	Data AdminAppTemplateListResponse `json:"data"`
	Msg string `json:"msg"`
}
