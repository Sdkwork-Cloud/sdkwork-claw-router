package types

// Accounts entries list result schema exposed by Claw Router.
type AccountsEntriesListResult struct {
	Code string `json:"code"`
	Data OpenPlatformEntryListResponse `json:"data"`
	Msg string `json:"msg"`
}
