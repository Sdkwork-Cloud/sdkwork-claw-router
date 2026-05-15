package types

// Billing recharge history item schema exposed by Claw Router.
type BillingRechargeHistoryItem struct {
	Amount string `json:"amount"`
	Date string `json:"date"`
	Id int `json:"id"`
	Method string `json:"method"`
	OrderNo string `json:"orderNo"`
	Status string `json:"status"`
}
