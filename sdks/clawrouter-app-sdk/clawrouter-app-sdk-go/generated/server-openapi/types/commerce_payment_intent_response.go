package types

// Commerce payment intent response schema exposed by Claw Router.
type CommercePaymentIntentResponse struct {
	Item CommercePaymentIntentItem `json:"item"`
}
