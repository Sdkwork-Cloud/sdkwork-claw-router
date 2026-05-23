package types

// Spaces retrieve result schema exposed by Claw Router.
type SpacesRetrieveResult struct {
	Code string `json:"code"`
	Data MemorySpaceItem `json:"data"`
	Msg string `json:"msg"`
}
