package types

// Billing recharge history item schema exposed by Claw Router.
type BillingRechargeHistoryItem struct {
	Amount string `json:"amount"`
	Date string `json:"date"`
	Id string `json:"id"`
	Method string `json:"method"`
	OrderNo string `json:"orderNo"`
	Status string `json:"status"`
}
