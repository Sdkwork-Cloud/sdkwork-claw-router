package types

// Spaces create result schema exposed by Claw Router.
type SpacesCreateResult struct {
	Code string `json:"code"`
	Data MemorySpaceResponse `json:"data"`
	Msg string `json:"msg"`
}
