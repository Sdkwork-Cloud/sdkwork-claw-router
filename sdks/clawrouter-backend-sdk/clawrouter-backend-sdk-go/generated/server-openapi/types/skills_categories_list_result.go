package types

// Skills categories list result schema exposed by Claw Router.
type SkillsCategoriesListResult struct {
	Code string `json:"code"`
	Data AdminSkillCategoryListResponse `json:"data"`
	Msg string `json:"msg"`
}
