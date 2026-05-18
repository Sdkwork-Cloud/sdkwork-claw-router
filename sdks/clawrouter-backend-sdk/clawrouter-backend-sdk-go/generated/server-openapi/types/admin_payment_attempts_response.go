package types

// Admin payment attempts response schema exposed by Claw Router.
type AdminPaymentAttemptsResponse struct {
	Items []AdminPaymentAttemptItem `json:"items"`
}
