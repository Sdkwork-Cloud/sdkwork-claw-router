package types

// Billing redeem history item schema exposed by Claw Router.
type BillingRedeemHistoryItem struct {
	Amount string `json:"amount"`
	Code string `json:"code"`
	Date string `json:"date"`
	Id string `json:"id"`
	Status string `json:"status"`
}
