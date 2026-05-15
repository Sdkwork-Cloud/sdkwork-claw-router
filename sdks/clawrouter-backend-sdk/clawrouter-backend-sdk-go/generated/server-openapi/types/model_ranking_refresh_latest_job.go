package types

// Model ranking refresh latest job schema exposed by Claw Router.
type ModelRankingRefreshLatestJob struct {
	DurationMs int `json:"durationMs"`
	EndedAt string `json:"endedAt"`
	FailureCount int `json:"failureCount"`
	FailureReason string `json:"failureReason"`
	GeneratedCount int `json:"generatedCount"`
	Id string `json:"id"`
	JobName string `json:"jobName"`
	NextRefreshAt string `json:"nextRefreshAt"`
	OrganizationId int `json:"organizationId"`
	RankScope string `json:"rankScope"`
	SnapshotDate string `json:"snapshotDate"`
	SnapshotPeriod string `json:"snapshotPeriod"`
	SourceCount int `json:"sourceCount"`
	StartedAt string `json:"startedAt"`
	Status string `json:"status"`
	SuccessCount int `json:"successCount"`
	TenantId int `json:"tenantId"`
	WindowEnd string `json:"windowEnd"`
	WindowStart string `json:"windowStart"`
}
