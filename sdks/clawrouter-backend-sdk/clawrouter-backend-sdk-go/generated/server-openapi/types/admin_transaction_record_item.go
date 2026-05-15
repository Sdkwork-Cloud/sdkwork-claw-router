package types

// Admin transaction record item schema exposed by Claw Router.
type AdminTransactionRecordItem struct {
	Amount string `json:"amount"`
	Balance string `json:"balance"`
	Description string `json:"description"`
	Id string `json:"id"`
	Status string `json:"status"`
	Time string `json:"time"`
	Type string `json:"type"`
	UserId string `json:"userId"`
}
