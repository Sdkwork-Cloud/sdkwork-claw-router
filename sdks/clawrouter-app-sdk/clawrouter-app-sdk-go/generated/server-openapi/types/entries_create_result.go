package types

// Entries create result schema exposed by Claw Router.
type EntriesCreateResult struct {
	Code string `json:"code"`
	Data MemoryEntryResponse `json:"data"`
	Msg string `json:"msg"`
}
