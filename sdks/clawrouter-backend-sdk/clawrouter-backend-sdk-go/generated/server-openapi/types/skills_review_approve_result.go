package types

// Skills review approve result schema exposed by Claw Router.
type SkillsReviewApproveResult struct {
	Code string `json:"code"`
	Data AdminSkillMutationResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
