package types

// Checkout sessions orders create result schema exposed by Claw Router.
type CheckoutSessionsOrdersCreateResult struct {
	Code string `json:"code"`
	Data CommerceOperationResponse `json:"data"`
	Msg string `json:"msg"`
}
