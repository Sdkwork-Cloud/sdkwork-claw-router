package types

// Redeem code response schema exposed by Claw Router.
type RedeemCodeResponse struct {
	Amount string `json:"amount"`
	Balance int `json:"balance"`
	CreditedPoints int `json:"creditedPoints"`
	Message string `json:"message"`
}
