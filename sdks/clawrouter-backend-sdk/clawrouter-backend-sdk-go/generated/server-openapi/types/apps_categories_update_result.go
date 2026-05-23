package types

// Apps categories update result schema exposed by Claw Router.
type AppsCategoriesUpdateResult struct {
	Code string `json:"code"`
	Data AdminAppCategoryMutationResponse `json:"data"`
	Msg string `json:"msg"`
}
