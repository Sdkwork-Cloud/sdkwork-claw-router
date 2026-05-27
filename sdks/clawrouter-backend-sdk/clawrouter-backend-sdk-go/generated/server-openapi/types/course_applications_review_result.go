package types

// Course applications review result schema exposed by Claw Router.
type CourseApplicationsReviewResult struct {
	Code string `json:"code"`
	Data AdminCourseApplicationReviewResponse `json:"data"`
	Msg string `json:"msg"`
}
