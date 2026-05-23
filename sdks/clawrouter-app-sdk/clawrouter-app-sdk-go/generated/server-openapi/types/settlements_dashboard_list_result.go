package types

// Settlements dashboard list result schema exposed by Claw Router.
type SettlementsDashboardListResult struct {
	Code string `json:"code"`
	Data SettlementDashboardResponse `json:"data"`
	Msg string `json:"msg"`
}
