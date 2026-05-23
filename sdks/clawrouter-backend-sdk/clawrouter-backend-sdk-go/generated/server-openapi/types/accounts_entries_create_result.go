package types

// Accounts entries create result schema exposed by Claw Router.
type AccountsEntriesCreateResult struct {
	Code string `json:"code"`
	Data OpenPlatformEntryResponse `json:"data"`
	Msg string `json:"msg"`
}
