package types

// Agent run list response schema exposed by Claw Router.
type AgentRunListResponse struct {
	Items []AgentRunItem `json:"items"`
}
