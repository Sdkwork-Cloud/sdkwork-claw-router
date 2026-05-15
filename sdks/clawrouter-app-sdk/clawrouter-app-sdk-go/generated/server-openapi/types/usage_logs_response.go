package types

// Usage logs response schema exposed by Claw Router.
type UsageLogsResponse struct {
	Logs []UsageLogItem `json:"logs"`
	Page int `json:"page"`
	PageSize int `json:"pageSize"`
	Total int `json:"total"`
}
