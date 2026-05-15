package types

// Model ranking refresh status schema exposed by Claw Router.
type ModelRankingRefreshStatus struct {
	CacheMaxAgeSeconds int `json:"cacheMaxAgeSeconds"`
	GeneratedAt string `json:"generatedAt"`
	GeneratedCount int `json:"generatedCount"`
	LatestJob ModelRankingRefreshLatestJob `json:"latestJob"`
	NextRefreshAt string `json:"nextRefreshAt"`
	OrganizationId int `json:"organizationId"`
	RankScope string `json:"rankScope"`
	RefreshIntervalSeconds int `json:"refreshIntervalSeconds"`
	SnapshotDate string `json:"snapshotDate"`
	SnapshotPeriod string `json:"snapshotPeriod"`
	SourceCount int `json:"sourceCount"`
	SourceTables []string `json:"sourceTables"`
	Status string `json:"status"`
	TenantId int `json:"tenantId"`
	WindowEnd string `json:"windowEnd"`
	WindowStart string `json:"windowStart"`
}
