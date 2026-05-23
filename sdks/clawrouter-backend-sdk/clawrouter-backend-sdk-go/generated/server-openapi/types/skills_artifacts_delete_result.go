package types

// Skills artifacts delete result schema exposed by Claw Router.
type SkillsArtifactsDeleteResult struct {
	Code string `json:"code"`
	Data AdminSkillArtifactDeleteResponse `json:"data"`
	Msg string `json:"msg"`
}
