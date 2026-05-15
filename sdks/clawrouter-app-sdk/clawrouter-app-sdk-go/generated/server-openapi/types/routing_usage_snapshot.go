package types

// Routing usage snapshot schema exposed by Claw Router.
type RoutingUsageSnapshot struct {
	ChartData []map[string]interface{} `json:"chartData"`
	ModelStats []map[string]interface{} `json:"modelStats"`
}
