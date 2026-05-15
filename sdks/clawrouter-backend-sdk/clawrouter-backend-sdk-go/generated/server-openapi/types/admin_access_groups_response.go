package types

// Admin access groups response schema exposed by Claw Router.
type AdminAccessGroupsResponse struct {
	Items []AdminAccessGroupItem `json:"items"`
}
