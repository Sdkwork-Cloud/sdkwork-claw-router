package types

// Wallet ledger entries list result schema exposed by Claw Router.
type WalletLedgerEntriesListResult struct {
	Code string `json:"code"`
	Data CommerceStandardCollectionResponse `json:"data"`
	Msg string `json:"msg"`
}
