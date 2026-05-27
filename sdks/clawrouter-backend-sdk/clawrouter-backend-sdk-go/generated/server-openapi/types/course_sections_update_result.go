package types

// Course sections update result schema exposed by Claw Router.
type CourseSectionsUpdateResult struct {
	Code string `json:"code"`
	Data AdminCourseSectionMutationResponse `json:"data"`
	Msg string `json:"msg"`
}
