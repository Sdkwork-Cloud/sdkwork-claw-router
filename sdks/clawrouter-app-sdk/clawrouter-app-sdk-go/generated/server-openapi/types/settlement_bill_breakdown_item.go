package types

// Settlement bill breakdown item schema exposed by Claw Router.
type SettlementBillBreakdownItem struct {
	Cost string `json:"cost"`
	Models []string `json:"models"`
	Usage string `json:"usage"`
}
