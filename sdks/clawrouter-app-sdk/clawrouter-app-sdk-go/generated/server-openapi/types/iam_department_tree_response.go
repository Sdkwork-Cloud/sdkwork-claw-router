package types

// Iam department tree response schema exposed by Claw Router.
type IamDepartmentTreeResponse struct {
	Items []IamDepartmentTreeItem `json:"items"`
}
