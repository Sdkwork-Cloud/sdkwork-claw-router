package types

// Memory space list response schema exposed by Claw Router.
type MemorySpaceListResponse struct {
	Items []MemorySpaceItem `json:"items"`
}
