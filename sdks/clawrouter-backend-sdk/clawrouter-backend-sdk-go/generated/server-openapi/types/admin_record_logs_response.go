package types

// Admin record logs response schema exposed by Claw Router.
type AdminRecordLogsResponse struct {
	Logs []AdminRecordLogItem `json:"logs"`
	Page int `json:"page"`
	PageSize int `json:"pageSize"`
	Total int `json:"total"`
}
