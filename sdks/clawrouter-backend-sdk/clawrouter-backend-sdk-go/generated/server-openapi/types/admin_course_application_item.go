package types

// Admin course application item schema exposed by Claw Router.
type AdminCourseApplicationItem struct {
	Id string `json:"id"`
	ReviewedAt string `json:"reviewedAt"`
	Status string `json:"status"`
}
