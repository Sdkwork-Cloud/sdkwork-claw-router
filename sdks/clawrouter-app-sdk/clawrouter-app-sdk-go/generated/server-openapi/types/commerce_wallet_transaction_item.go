package types

// Commerce wallet transaction item schema exposed by Claw Router.
type CommerceWalletTransactionItem struct {
	Amount string `json:"amount"`
	BalanceAfter string `json:"balanceAfter"`
	BusinessType string `json:"businessType"`
	CreatedAt string `json:"createdAt"`
	Direction string `json:"direction"`
	Id string `json:"id"`
	TransactionNo string `json:"transactionNo"`
}
