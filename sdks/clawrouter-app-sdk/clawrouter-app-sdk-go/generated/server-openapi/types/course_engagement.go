package types

// Course engagement schema exposed by Claw Router.
type CourseEngagement struct {
	Discussions int `json:"discussions"`
	Likes int `json:"likes"`
	Saves int `json:"saves"`
	Shares int `json:"shares"`
	StudentsCount int `json:"studentsCount"`
	Views int `json:"views"`
}
