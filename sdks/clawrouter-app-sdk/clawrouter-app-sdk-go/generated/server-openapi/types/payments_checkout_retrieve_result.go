package types

// Payments checkout retrieve result schema exposed by Claw Router.
type PaymentsCheckoutRetrieveResult struct {
	Code string `json:"code"`
	Data CheckoutStatusResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
