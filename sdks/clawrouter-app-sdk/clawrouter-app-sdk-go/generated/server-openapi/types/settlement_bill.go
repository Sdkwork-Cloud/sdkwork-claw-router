package types

// Settlement bill schema exposed by Claw Router.
type SettlementBill struct {
	Breakdown SettlementBillBreakdown `json:"breakdown"`
	EndDate string `json:"endDate"`
	Id string `json:"id"`
	Period string `json:"period"`
	StartDate string `json:"startDate"`
	Status string `json:"status"`
	TotalCost string `json:"totalCost"`
	TotalTokens string `json:"totalTokens"`
}
