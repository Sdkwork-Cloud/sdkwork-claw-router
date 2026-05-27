package types

// Courses relations list result schema exposed by Claw Router.
type CoursesRelationsListResult struct {
	Code string `json:"code"`
	Data AdminCourseRelationCollectionResponse `json:"data"`
	Msg string `json:"msg"`
}
