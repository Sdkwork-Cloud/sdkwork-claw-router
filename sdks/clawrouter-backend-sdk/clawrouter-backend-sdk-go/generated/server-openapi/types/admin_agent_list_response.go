package types

// Admin agent list response schema exposed by Claw Router.
type AdminAgentListResponse struct {
	Items []AdminAgentItem `json:"items"`
}
