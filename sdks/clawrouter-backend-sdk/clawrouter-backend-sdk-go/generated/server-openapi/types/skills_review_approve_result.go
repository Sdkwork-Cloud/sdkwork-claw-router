package types

// Skills review approve result schema exposed by Claw Router.
type SkillsReviewApproveResult struct {
	Code string `json:"code"`
	Data AdminSkillMutationResponse `json:"data"`
	Msg string `json:"msg"`
}
