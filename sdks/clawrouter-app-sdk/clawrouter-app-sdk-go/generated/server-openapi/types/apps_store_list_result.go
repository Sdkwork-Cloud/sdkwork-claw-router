package types

// Apps store list result schema exposed by Claw Router.
type AppsStoreListResult struct {
	Code string `json:"code"`
	Data AppCatalogResponse `json:"data"`
	Msg string `json:"msg"`
}
