package types

// Admin mcp health check response schema exposed by Claw Router.
type AdminMcpHealthCheckResponse struct {
	CheckedAt string `json:"checkedAt"`
	ErrorMasked string `json:"errorMasked"`
	HealthStatus string `json:"healthStatus"`
	Healthy bool `json:"healthy"`
	LatencyMs int `json:"latencyMs"`
	ServerId int `json:"serverId"`
}
