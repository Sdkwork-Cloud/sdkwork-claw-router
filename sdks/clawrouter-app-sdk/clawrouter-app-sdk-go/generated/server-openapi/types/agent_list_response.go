package types

// Agent list response schema exposed by Claw Router.
type AgentListResponse struct {
	Items []AgentItem `json:"items"`
}
