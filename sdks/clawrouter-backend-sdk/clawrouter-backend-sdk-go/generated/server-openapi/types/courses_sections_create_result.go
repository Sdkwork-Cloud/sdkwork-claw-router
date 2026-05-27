package types

// Courses sections create result schema exposed by Claw Router.
type CoursesSectionsCreateResult struct {
	Code string `json:"code"`
	Data AdminCourseSectionMutationResponse `json:"data"`
	Msg string `json:"msg"`
}
