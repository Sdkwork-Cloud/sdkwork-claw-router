package types

// Iam department assignment list response schema exposed by Claw Router.
type IamDepartmentAssignmentListResponse struct {
	Items []IamDepartmentAssignmentItem `json:"items"`
}
