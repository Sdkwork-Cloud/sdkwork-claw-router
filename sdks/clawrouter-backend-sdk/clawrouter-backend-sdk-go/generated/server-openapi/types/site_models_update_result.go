package types

// Site models update result schema exposed by Claw Router.
type SiteModelsUpdateResult struct {
	Code string `json:"code"`
	Data AdminSiteModelMutationResponse `json:"data"`
	Msg string `json:"msg"`
}
