package types

// Skills unpublish result schema exposed by Claw Router.
type SkillsUnpublishResult struct {
	Code string `json:"code"`
	Data AdminSkillMutationResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
