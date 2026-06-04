package types

// Routing usage data schema exposed by Claw Router.
type RoutingUsageData struct {
	Latency int `json:"latency"`
	Requests int `json:"requests"`
	Time string `json:"time"`
}
