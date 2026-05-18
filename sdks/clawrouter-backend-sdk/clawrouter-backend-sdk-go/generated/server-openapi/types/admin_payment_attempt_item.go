package types

// Admin payment attempt item schema exposed by Claw Router.
type AdminPaymentAttemptItem struct {
	Amount string `json:"amount"`
	CreatedAt string `json:"createdAt"`
	Id string `json:"id"`
	OrderNo string `json:"orderNo"`
	Provider string `json:"provider"`
	Status string `json:"status"`
}
