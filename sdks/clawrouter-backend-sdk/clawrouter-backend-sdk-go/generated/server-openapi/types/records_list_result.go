package types

// Records list result schema exposed by Claw Router.
type RecordsListResult struct {
	Code string `json:"code"`
	Data AdminRecordLogsResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
