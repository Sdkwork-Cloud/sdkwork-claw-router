package types

// Course overview source schema exposed by Claw Router.
type CourseOverviewSource struct {
	ObservedAt string `json:"observedAt"`
	SourceDescription string `json:"sourceDescription"`
	SourceLabel string `json:"sourceLabel"`
	SourceTables []string `json:"sourceTables"`
}
