package types

// Admin course application review request schema exposed by Claw Router.
type AdminCourseApplicationReviewRequest struct {
	ReviewNote string `json:"reviewNote"`
	Status string `json:"status"`
}
