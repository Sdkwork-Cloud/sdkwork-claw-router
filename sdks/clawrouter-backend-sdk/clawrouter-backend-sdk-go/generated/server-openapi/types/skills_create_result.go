package types

// Skills create result schema exposed by Claw Router.
type SkillsCreateResult struct {
	Code string `json:"code"`
	Data AdminSkillMutationResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
