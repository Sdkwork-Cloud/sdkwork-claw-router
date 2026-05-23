package types

// Admin analytics summary schema exposed by Claw Router.
type AdminAnalyticsSummary struct {
	ActiveModels int `json:"activeModels"`
	ActiveUsers int `json:"activeUsers"`
	AveragePointsPerRequest float64 `json:"averagePointsPerRequest"`
	AverageTokensPerRequest float64 `json:"averageTokensPerRequest"`
	ErrorRate float64 `json:"errorRate"`
	FailedRequests int `json:"failedRequests"`
	SuccessfulRequests int `json:"successfulRequests"`
	TotalPoints float64 `json:"totalPoints"`
	TotalRequests int `json:"totalRequests"`
	TotalTokens float64 `json:"totalTokens"`
	TotalUsers int `json:"totalUsers"`
	UpstreamCost float64 `json:"upstreamCost"`
}
