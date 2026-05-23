package types

// Skills artifacts list result schema exposed by Claw Router.
type SkillsArtifactsListResult struct {
	Code string `json:"code"`
	Data AdminSkillArtifactListResponse `json:"data"`
	Msg string `json:"msg"`
}
