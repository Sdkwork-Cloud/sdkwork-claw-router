package types

// Admin skill list response schema exposed by Claw Router.
type AdminSkillListResponse struct {
	Items []AdminSkillItem `json:"items"`
}
