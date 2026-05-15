package types

// Account points history list result schema exposed by Claw Router.
type AccountPointsHistoryListResult struct {
	Code string `json:"code"`
	Data CommercePointsHistoryResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
