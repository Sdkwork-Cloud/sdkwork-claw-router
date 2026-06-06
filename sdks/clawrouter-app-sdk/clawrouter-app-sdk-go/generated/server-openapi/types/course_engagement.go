package types

// Course engagement schema exposed by Claw Router.
type CourseEngagement struct {
	Discussions string `json:"discussions"`
	Likes string `json:"likes"`
	Saves string `json:"saves"`
	Shares string `json:"shares"`
	StudentsCount string `json:"studentsCount"`
	Views string `json:"views"`
}
