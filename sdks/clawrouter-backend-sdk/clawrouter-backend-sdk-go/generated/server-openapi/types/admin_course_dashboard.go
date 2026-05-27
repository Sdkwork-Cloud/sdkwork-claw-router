package types

// Admin course dashboard schema exposed by Claw Router.
type AdminCourseDashboard struct {
	DraftCourses int `json:"draftCourses"`
	Id string `json:"id"`
	PublishedCourses int `json:"publishedCourses"`
	ReviewQueue int `json:"reviewQueue"`
	TotalComments int `json:"totalComments"`
	TotalCourses int `json:"totalCourses"`
	TotalEngagement int `json:"totalEngagement"`
	TotalLessons int `json:"totalLessons"`
	TotalStudents int `json:"totalStudents"`
}
