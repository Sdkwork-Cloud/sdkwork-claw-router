package types

// Admin course application collection response schema exposed by Claw Router.
type AdminCourseApplicationCollectionResponse struct {
	Items []AdminCourseApplicationItem `json:"items"`
}
