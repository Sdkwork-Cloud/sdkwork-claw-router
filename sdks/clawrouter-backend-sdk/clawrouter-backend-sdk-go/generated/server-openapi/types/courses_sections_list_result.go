package types

// Courses sections list result schema exposed by Claw Router.
type CoursesSectionsListResult struct {
	Code string `json:"code"`
	Data AdminCourseSectionCollectionResponse `json:"data"`
	Msg string `json:"msg"`
}
