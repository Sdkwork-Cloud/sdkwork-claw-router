package types

// Entries retrieve result schema exposed by Claw Router.
type EntriesRetrieveResult struct {
	Code string `json:"code"`
	Data MemoryEntryItem `json:"data"`
	Msg string `json:"msg"`
}
