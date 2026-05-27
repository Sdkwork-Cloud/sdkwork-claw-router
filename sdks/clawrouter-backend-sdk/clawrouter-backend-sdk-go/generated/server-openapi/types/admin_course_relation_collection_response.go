package types

// Admin course relation collection response schema exposed by Claw Router.
type AdminCourseRelationCollectionResponse struct {
	Items []AdminCourseRelationItem `json:"items"`
}
