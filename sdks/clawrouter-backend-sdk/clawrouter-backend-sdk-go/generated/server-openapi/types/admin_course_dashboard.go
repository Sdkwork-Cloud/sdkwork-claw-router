package types

// Admin course dashboard schema exposed by Claw Router.
type AdminCourseDashboard struct {
	DraftCourses string `json:"draftCourses"`
	Id string `json:"id"`
	PublishedCourses string `json:"publishedCourses"`
	ReviewQueue string `json:"reviewQueue"`
	TotalComments string `json:"totalComments"`
	TotalCourses string `json:"totalCourses"`
	TotalEngagement string `json:"totalEngagement"`
	TotalLessons string `json:"totalLessons"`
	TotalStudents string `json:"totalStudents"`
}
