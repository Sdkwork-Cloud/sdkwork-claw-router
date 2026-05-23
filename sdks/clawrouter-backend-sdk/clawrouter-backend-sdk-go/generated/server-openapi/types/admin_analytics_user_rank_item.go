package types

// Admin analytics user rank item schema exposed by Claw Router.
type AdminAnalyticsUserRankItem struct {
	Email string `json:"email"`
	ModelDistribution []AdminPieChartItem `json:"modelDistribution"`
	Points float64 `json:"points"`
	Rank int `json:"rank"`
	RequestCount int `json:"requestCount"`
	TotalTokens float64 `json:"totalTokens"`
	UserId string `json:"userId"`
	UserName string `json:"userName"`
}
