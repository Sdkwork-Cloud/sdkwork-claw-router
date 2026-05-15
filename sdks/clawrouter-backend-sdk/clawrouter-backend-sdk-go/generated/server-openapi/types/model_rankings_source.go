package types

// Model rankings source schema exposed by Claw Router.
type ModelRankingsSource struct {
	CacheMaxAgeSeconds int `json:"cacheMaxAgeSeconds"`
	GeneratedAt string `json:"generatedAt"`
	NextRefreshAt string `json:"nextRefreshAt"`
	ObservedAt string `json:"observedAt"`
	RankScope string `json:"rankScope"`
	RefreshIntervalSeconds int `json:"refreshIntervalSeconds"`
	SnapshotDate string `json:"snapshotDate"`
	SnapshotPeriod string `json:"snapshotPeriod"`
	SourceDescription string `json:"sourceDescription"`
	SourceLabel string `json:"sourceLabel"`
	SourceTables []string `json:"sourceTables"`
	WindowEnd string `json:"windowEnd"`
	WindowStart string `json:"windowStart"`
}
