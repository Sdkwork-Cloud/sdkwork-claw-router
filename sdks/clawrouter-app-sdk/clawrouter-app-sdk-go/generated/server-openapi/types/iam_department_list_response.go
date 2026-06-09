package types

// Iam department list response schema exposed by Claw Router.
type IamDepartmentListResponse struct {
	Items []IamDepartmentItem `json:"items"`
}
