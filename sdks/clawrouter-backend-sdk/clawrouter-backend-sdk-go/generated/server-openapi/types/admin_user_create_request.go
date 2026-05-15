package types

// Admin user create request schema exposed by Claw Router.
type AdminUserCreateRequest struct {
	Balance string `json:"balance"`
	Email string `json:"email"`
	Username string `json:"username"`
}
