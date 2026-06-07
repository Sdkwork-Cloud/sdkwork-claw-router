package types

// Payments route rules list result schema exposed by Claw Router.
type PaymentsRouteRulesListResult struct {
	Code string `json:"code"`
	Data CommercePaymentRouteRuleListResponse `json:"data"`
	Msg string `json:"msg"`
}
