package types

// Course overview schema exposed by Claw Router.
type CourseOverview struct {
	Source CourseOverviewSource `json:"source"`
	Stats CourseOverviewStats `json:"stats"`
}
