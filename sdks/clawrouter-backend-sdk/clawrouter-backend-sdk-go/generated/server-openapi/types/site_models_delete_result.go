package types

// Site models delete result schema exposed by Claw Router.
type SiteModelsDeleteResult struct {
	Code string `json:"code"`
	Data AdminSiteDeleteResponse `json:"data"`
	Msg string `json:"msg"`
}
