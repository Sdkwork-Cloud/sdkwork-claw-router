package types

// Spaces list result schema exposed by Claw Router.
type SpacesListResult struct {
	Code string `json:"code"`
	Data MemorySpaceListResponse `json:"data"`
	Msg string `json:"msg"`
}
