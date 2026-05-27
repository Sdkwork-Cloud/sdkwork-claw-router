package types

// Commerce payment attempt response schema exposed by Claw Router.
type CommercePaymentAttemptResponse struct {
	Item CommercePaymentAttemptItem `json:"item"`
}
