package types

// Apps categories create result schema exposed by Claw Router.
type AppsCategoriesCreateResult struct {
	Code string `json:"code"`
	Data AdminAppCategoryMutationResponse `json:"data"`
	Msg string `json:"msg"`
}
