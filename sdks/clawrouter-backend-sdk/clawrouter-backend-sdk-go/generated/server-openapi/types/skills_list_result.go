package types

// Skills list result schema exposed by Claw Router.
type SkillsListResult struct {
	Code string `json:"code"`
	Data AdminSkillListResponse `json:"data"`
	Msg string `json:"msg"`
}
