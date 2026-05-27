package types

// Apps templates delete result schema exposed by Claw Router.
type AppsTemplatesDeleteResult struct {
	Code string `json:"code"`
	Data AdminAppTemplateDeleteResponse `json:"data"`
	Msg string `json:"msg"`
}
