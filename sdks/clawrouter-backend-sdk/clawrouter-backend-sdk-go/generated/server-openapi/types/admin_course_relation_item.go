package types

// Admin course relation item schema exposed by Claw Router.
type AdminCourseRelationItem struct {
	CourseId string `json:"courseId"`
	Id string `json:"id"`
	RelatedCourseId string `json:"relatedCourseId"`
	RelationType string `json:"relationType"`
	SortOrder string `json:"sortOrder"`
	Status string `json:"status"`
}
