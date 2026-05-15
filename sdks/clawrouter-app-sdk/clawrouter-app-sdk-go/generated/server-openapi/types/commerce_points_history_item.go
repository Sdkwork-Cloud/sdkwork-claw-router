package types

// Commerce points history item schema exposed by Claw Router.
type CommercePointsHistoryItem struct {
	Amount int `json:"amount"`
	BalanceAfter int `json:"balanceAfter"`
	BusinessType string `json:"businessType"`
	CreatedAt string `json:"createdAt"`
	Direction string `json:"direction"`
	Id string `json:"id"`
}
