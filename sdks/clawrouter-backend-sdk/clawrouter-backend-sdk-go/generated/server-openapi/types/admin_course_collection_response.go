package types

// Admin course collection response schema exposed by Claw Router.
type AdminCourseCollectionResponse struct {
	Items []AdminCourseItem `json:"items"`
}
