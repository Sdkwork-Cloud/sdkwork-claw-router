package types

// Admin skill category list response schema exposed by Claw Router.
type AdminSkillCategoryListResponse struct {
	Items []AdminSkillCategoryItem `json:"items"`
}
