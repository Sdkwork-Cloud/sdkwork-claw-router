package types

// Admin skill review request schema exposed by Claw Router.
type AdminSkillReviewRequest struct {
	Comment string `json:"comment"`
	ReviewComment string `json:"reviewComment"`
}
