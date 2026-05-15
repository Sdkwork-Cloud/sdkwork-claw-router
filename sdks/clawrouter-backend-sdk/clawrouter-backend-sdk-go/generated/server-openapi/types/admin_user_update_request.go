package types

// Admin user update request schema exposed by Claw Router.
type AdminUserUpdateRequest struct {
	Group string `json:"group"`
	Id int `json:"id"`
	Status string `json:"status"`
	Username string `json:"username"`
}
