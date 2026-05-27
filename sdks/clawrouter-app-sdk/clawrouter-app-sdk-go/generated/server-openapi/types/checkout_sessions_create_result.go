package types

// Checkout sessions create result schema exposed by Claw Router.
type CheckoutSessionsCreateResult struct {
	Code string `json:"code"`
	Data CommerceOperationResponse `json:"data"`
	Msg string `json:"msg"`
}
