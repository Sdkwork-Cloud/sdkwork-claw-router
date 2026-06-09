package types

// Iam position assignment list response schema exposed by Claw Router.
type IamPositionAssignmentListResponse struct {
	Items []IamPositionAssignmentItem `json:"items"`
}
