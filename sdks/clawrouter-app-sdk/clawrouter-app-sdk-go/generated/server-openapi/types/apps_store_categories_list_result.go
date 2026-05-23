package types

// Apps store categories list result schema exposed by Claw Router.
type AppsStoreCategoriesListResult struct {
	Code string `json:"code"`
	Data AppCategoriesResponse `json:"data"`
	Msg string `json:"msg"`
}
