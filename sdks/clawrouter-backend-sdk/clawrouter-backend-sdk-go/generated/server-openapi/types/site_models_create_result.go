package types

// Site models create result schema exposed by Claw Router.
type SiteModelsCreateResult struct {
	Code string `json:"code"`
	Data AdminSiteModelMutationResponse `json:"data"`
	Msg string `json:"msg"`
}
