package types

// Models list result schema exposed by Claw Router.
type ModelsListResult struct {
	Code string `json:"code"`
	Data AppModelCatalogResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
