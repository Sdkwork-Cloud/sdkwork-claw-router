package types

// Course overview stats schema exposed by Claw Router.
type CourseOverviewStats struct {
	TotalCategories int `json:"totalCategories"`
	TotalCourses int `json:"totalCourses"`
	TotalLessons int `json:"totalLessons"`
	TotalStudents int `json:"totalStudents"`
}
