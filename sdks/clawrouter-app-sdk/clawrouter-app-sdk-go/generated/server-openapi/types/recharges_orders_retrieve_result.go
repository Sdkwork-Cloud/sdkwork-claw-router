package types

// Recharges orders retrieve result schema exposed by Claw Router.
type RechargesOrdersRetrieveResult struct {
	Code string `json:"code"`
	Data CommerceRechargeCheckoutStatusResponse `json:"data"`
	Msg string `json:"msg"`
}
