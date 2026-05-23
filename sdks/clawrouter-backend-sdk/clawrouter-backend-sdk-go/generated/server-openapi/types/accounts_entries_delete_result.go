package types

// Accounts entries delete result schema exposed by Claw Router.
type AccountsEntriesDeleteResult struct {
	Code string `json:"code"`
	Data OpenPlatformEntryResponse `json:"data"`
	Msg string `json:"msg"`
}
