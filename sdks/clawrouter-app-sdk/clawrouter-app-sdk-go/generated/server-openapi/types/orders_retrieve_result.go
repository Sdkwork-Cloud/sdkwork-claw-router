package types

// Orders retrieve result schema exposed by Claw Router.
type OrdersRetrieveResult struct {
	Code string `json:"code"`
	Data CommerceStandardResourceResponse `json:"data"`
	Msg string `json:"msg"`
}
