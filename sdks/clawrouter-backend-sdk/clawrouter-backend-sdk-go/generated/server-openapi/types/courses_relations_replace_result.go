package types

// Courses relations replace result schema exposed by Claw Router.
type CoursesRelationsReplaceResult struct {
	Code string `json:"code"`
	Data AdminCourseRelationCollectionResponse `json:"data"`
	Msg string `json:"msg"`
}
