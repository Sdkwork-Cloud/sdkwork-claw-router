package types

// Skills artifacts update result schema exposed by Claw Router.
type SkillsArtifactsUpdateResult struct {
	Code string `json:"code"`
	Data AdminSkillArtifactMutationResponse `json:"data"`
	Msg string `json:"msg"`
}
