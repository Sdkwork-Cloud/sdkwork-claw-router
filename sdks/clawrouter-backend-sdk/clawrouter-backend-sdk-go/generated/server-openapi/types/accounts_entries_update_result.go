package types

// Accounts entries update result schema exposed by Claw Router.
type AccountsEntriesUpdateResult struct {
	Code string `json:"code"`
	Data OpenPlatformEntryResponse `json:"data"`
	Msg string `json:"msg"`
}
