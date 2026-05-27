package types

// Admin course lesson collection response schema exposed by Claw Router.
type AdminCourseLessonCollectionResponse struct {
	Items []AdminCourseLessonItem `json:"items"`
}
