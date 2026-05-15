package types

// Submit recharge response schema exposed by Claw Router.
type SubmitRechargeResponse struct {
	Amount string `json:"amount"`
	OrderNo string `json:"orderNo"`
	PaymentMethod string `json:"paymentMethod"`
	Points int `json:"points"`
	Status string `json:"status"`
	Success bool `json:"success"`
}
