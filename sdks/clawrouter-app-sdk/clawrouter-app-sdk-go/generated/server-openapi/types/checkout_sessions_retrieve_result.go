package types

// Checkout sessions retrieve result schema exposed by Claw Router.
type CheckoutSessionsRetrieveResult struct {
	Code string `json:"code"`
	Data CommerceStandardResourceResponse `json:"data"`
	Msg string `json:"msg"`
}
