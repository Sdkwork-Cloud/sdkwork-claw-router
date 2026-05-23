package types

// Skills categories update result schema exposed by Claw Router.
type SkillsCategoriesUpdateResult struct {
	Code string `json:"code"`
	Data AdminSkillCategoryMutationResponse `json:"data"`
	Msg string `json:"msg"`
}
