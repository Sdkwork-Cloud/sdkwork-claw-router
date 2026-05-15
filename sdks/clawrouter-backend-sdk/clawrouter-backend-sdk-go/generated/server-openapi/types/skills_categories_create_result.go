package types

// Skills categories create result schema exposed by Claw Router.
type SkillsCategoriesCreateResult struct {
	Code string `json:"code"`
	Data AdminSkillCategoryMutationResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
