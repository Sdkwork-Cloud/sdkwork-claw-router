package types

// Admin redemption record item schema exposed by Claw Router.
type AdminRedemptionRecordItem struct {
	Amount string `json:"amount"`
	Code string `json:"code"`
	Id string `json:"id"`
	Time string `json:"time"`
	User string `json:"user"`
	UserId string `json:"userId"`
}
