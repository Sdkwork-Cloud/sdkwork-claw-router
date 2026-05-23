package types

// Skills review reject result schema exposed by Claw Router.
type SkillsReviewRejectResult struct {
	Code string `json:"code"`
	Data AdminSkillMutationResponse `json:"data"`
	Msg string `json:"msg"`
}
