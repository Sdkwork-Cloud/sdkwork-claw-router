package types

// Persisted admin user snapshot returned by the backend.
type AdminUserItem struct {
	Balance string `json:"balance"`
	CreatedAt string `json:"createdAt"`
	Email string `json:"email"`
	Group string `json:"group"`
	Id int `json:"id"`
	LastActive string `json:"lastActive"`
	LastUsed string `json:"lastUsed"`
	Role string `json:"role"`
	Status string `json:"status"`
	Username string `json:"username"`
}
