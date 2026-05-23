package types

// Entries list result schema exposed by Claw Router.
type EntriesListResult struct {
	Code string `json:"code"`
	Data MemoryEntryListResponse `json:"data"`
	Msg string `json:"msg"`
}
