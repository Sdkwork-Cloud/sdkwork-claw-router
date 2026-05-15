package types

// Skills update result schema exposed by Claw Router.
type SkillsUpdateResult struct {
	Code string `json:"code"`
	Data AdminSkillMutationResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
