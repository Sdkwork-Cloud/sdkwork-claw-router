package types

// Apps categories delete result schema exposed by Claw Router.
type AppsCategoriesDeleteResult struct {
	Code string `json:"code"`
	Data AdminAppCategoryDeleteResponse `json:"data"`
	Msg string `json:"msg"`
}
