package types

// Skills artifacts update result schema exposed by Claw Router.
type SkillsArtifactsUpdateResult struct {
	Code string `json:"code"`
	Data AdminSkillArtifactMutationResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
