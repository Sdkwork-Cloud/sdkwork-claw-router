package types

// Admin course item schema exposed by Claw Router.
type AdminCourseItem struct {
	CourseCode string `json:"courseCode"`
	Id string `json:"id"`
	Status string `json:"status"`
	Title string `json:"title"`
}
