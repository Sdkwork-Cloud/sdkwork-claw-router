package types

// Model ranking refresh trigger response schema exposed by Claw Router.
type ModelRankingRefreshTriggerResponse struct {
	CacheMaxAgeSeconds int `json:"cacheMaxAgeSeconds"`
	GeneratedCount int `json:"generatedCount"`
	NextRefreshAt string `json:"nextRefreshAt"`
	OrganizationId int `json:"organizationId"`
	RankScope string `json:"rankScope"`
	RefreshIntervalSeconds int `json:"refreshIntervalSeconds"`
	SnapshotDate string `json:"snapshotDate"`
	SnapshotPeriod string `json:"snapshotPeriod"`
	SourceCount int `json:"sourceCount"`
	Status string `json:"status"`
	TenantId int `json:"tenantId"`
	Triggered bool `json:"triggered"`
	WindowEnd string `json:"windowEnd"`
	WindowStart string `json:"windowStart"`
}
