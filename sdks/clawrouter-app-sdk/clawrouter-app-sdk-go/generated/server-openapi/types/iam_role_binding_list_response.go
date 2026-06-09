package types

// Iam role binding list response schema exposed by Claw Router.
type IamRoleBindingListResponse struct {
	Items []IamRoleBindingItem `json:"items"`
}
