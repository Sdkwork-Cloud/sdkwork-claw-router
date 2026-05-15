package types

// Skills publish result schema exposed by Claw Router.
type SkillsPublishResult struct {
	Code string `json:"code"`
	Data AdminSkillMutationResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
