package types

// Site models replace result schema exposed by Claw Router.
type SiteModelsReplaceResult struct {
	Code string `json:"code"`
	Data AdminSiteModelsReplaceResponse `json:"data"`
	Msg string `json:"msg"`
}
