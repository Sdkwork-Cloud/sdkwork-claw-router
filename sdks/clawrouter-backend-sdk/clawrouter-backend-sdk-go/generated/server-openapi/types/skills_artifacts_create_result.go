package types

// Skills artifacts create result schema exposed by Claw Router.
type SkillsArtifactsCreateResult struct {
	Code string `json:"code"`
	Data AdminSkillArtifactMutationResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
