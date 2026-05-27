package types

// Checkout sessions quotes create result schema exposed by Claw Router.
type CheckoutSessionsQuotesCreateResult struct {
	Code string `json:"code"`
	Data CommerceOperationResponse `json:"data"`
	Msg string `json:"msg"`
}
