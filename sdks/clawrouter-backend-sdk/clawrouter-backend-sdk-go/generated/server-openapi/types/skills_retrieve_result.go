package types

// Skills retrieve result schema exposed by Claw Router.
type SkillsRetrieveResult struct {
	Code string `json:"code"`
	Data AdminSkillMutationResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
