package types

// Position assignments list result schema exposed by Claw Router.
type PositionAssignmentsListResult struct {
	Code string `json:"code"`
	Data IamPositionAssignmentListResponse `json:"data"`
	Msg string `json:"msg"`
}
