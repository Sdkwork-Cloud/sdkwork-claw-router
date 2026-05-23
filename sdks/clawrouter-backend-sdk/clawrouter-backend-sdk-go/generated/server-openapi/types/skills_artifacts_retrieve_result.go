package types

// Skills artifacts retrieve result schema exposed by Claw Router.
type SkillsArtifactsRetrieveResult struct {
	Code string `json:"code"`
	Data AdminSkillArtifactMutationResponse `json:"data"`
	Msg string `json:"msg"`
}
