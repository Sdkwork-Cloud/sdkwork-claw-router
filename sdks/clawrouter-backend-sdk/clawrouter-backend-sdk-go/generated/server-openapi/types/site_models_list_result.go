package types

// Site models list result schema exposed by Claw Router.
type SiteModelsListResult struct {
	Code string `json:"code"`
	Data AdminSiteModelsResponse `json:"data"`
	Msg string `json:"msg"`
}
