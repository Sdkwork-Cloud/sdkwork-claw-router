package types

// Skills categories delete result schema exposed by Claw Router.
type SkillsCategoriesDeleteResult struct {
	Code string `json:"code"`
	Data AdminSkillCategoryDeleteResponse `json:"data"`
	Msg string `json:"msg"`
}
