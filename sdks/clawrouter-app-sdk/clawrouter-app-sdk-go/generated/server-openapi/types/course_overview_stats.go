package types

// Course overview stats schema exposed by Claw Router.
type CourseOverviewStats struct {
	TotalCategories string `json:"totalCategories"`
	TotalCourses string `json:"totalCourses"`
	TotalLessons string `json:"totalLessons"`
	TotalStudents string `json:"totalStudents"`
}
