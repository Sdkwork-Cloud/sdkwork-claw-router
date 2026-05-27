package types

// Course engagement list result schema exposed by Claw Router.
type CourseEngagementListResult struct {
	Code string `json:"code"`
	Data AdminCourseEngagementCollectionResponse `json:"data"`
	Msg string `json:"msg"`
}
