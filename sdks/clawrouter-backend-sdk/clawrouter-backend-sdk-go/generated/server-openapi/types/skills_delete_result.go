package types

// Skills delete result schema exposed by Claw Router.
type SkillsDeleteResult struct {
	Code string `json:"code"`
	Data AdminSkillDeleteResponse `json:"data"`
	Msg string `json:"msg"`
}
