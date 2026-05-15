package types

// Models refresh result schema exposed by Claw Router.
type ModelsRefreshResult struct {
	Code string `json:"code"`
	Data AdminModelCatalogSyncResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
