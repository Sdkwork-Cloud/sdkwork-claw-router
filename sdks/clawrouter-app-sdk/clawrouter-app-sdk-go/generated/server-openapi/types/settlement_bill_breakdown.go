package types

// Settlement bill breakdown schema exposed by Claw Router.
type SettlementBillBreakdown struct {
	Audio SettlementBillBreakdownItem `json:"audio"`
	Image SettlementBillBreakdownItem `json:"image"`
	Music SettlementBillBreakdownItem `json:"music"`
	Text SettlementBillBreakdownItem `json:"text"`
	Video SettlementBillBreakdownItem `json:"video"`
}
