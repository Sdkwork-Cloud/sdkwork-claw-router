package types

// Admin recharge record item schema exposed by Claw Router.
type AdminRechargeRecordItem struct {
	Amount string `json:"amount"`
	Id string `json:"id"`
	Method string `json:"method"`
	Status string `json:"status"`
	Time string `json:"time"`
	TradeNo string `json:"tradeNo"`
	UsdCredited string `json:"usd_credited"`
	User string `json:"user"`
	UserId string `json:"userId"`
}
