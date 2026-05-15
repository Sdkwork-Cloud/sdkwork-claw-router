package types

// Admin users response schema exposed by Claw Router.
type AdminUsersResponse struct {
	Items []AdminUserItem `json:"items"`
}
