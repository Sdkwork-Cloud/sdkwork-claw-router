package types

// Memory entry list response schema exposed by Claw Router.
type MemoryEntryListResponse struct {
	Items []MemoryEntryItem `json:"items"`
}
