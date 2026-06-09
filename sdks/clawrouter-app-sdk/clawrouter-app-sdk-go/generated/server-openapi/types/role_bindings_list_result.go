package types

// Role bindings list result schema exposed by Claw Router.
type RoleBindingsListResult struct {
	Code string `json:"code"`
	Data IamRoleBindingListResponse `json:"data"`
	Msg string `json:"msg"`
}
