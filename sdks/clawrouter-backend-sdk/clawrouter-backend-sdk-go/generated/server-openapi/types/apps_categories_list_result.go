package types

// Apps categories list result schema exposed by Claw Router.
type AppsCategoriesListResult struct {
	Code string `json:"code"`
	Data AdminAppCategoryListResponse `json:"data"`
	Msg string `json:"msg"`
}
