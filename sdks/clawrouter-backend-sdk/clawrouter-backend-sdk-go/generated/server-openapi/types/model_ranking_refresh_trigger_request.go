package types

// Model ranking refresh trigger request schema exposed by Claw Router.
type ModelRankingRefreshTriggerRequest struct {
	CacheMaxAgeSeconds int `json:"cacheMaxAgeSeconds"`
	Limit int `json:"limit"`
	LookbackDays int `json:"lookbackDays"`
	RankScope string `json:"rankScope"`
	RefreshIntervalSeconds int `json:"refreshIntervalSeconds"`
	SnapshotPeriod string `json:"snapshotPeriod"`
}
