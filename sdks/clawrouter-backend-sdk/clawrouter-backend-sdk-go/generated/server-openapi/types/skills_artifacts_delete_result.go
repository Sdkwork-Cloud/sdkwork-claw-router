package types

// Skills artifacts delete result schema exposed by Claw Router.
type SkillsArtifactsDeleteResult struct {
	Code string `json:"code"`
	Data AdminSkillArtifactDeleteResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
