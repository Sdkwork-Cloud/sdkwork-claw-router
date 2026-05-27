package types

// Recharges orders create result schema exposed by Claw Router.
type RechargesOrdersCreateResult struct {
	Code string `json:"code"`
	Data CommerceOperationResponse `json:"data"`
	Msg string `json:"msg"`
}
