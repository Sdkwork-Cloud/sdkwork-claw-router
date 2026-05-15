package types

// Settlement dashboard response schema exposed by Claw Router.
type SettlementDashboardResponse struct {
	Bills []SettlementBill `json:"bills"`
	ChartData []SettlementChartPoint `json:"chartData"`
}
