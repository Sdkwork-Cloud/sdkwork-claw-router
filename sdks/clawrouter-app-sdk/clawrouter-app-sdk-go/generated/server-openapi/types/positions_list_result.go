package types

// Positions list result schema exposed by Claw Router.
type PositionsListResult struct {
	Code string `json:"code"`
	Data IamPositionListResponse `json:"data"`
	Msg string `json:"msg"`
}
