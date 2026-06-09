package types

// Iam organization tree response schema exposed by Claw Router.
type IamOrganizationTreeResponse struct {
	Items []IamOrganizationTreeItem `json:"items"`
}
