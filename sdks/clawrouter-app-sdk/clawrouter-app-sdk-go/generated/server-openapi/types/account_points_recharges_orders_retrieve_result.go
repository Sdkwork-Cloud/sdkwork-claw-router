package types

// Account points recharges orders retrieve result schema exposed by Claw Router.
type AccountPointsRechargesOrdersRetrieveResult struct {
	Code string `json:"code"`
	Data CheckoutStatusResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
