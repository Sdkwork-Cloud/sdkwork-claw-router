package types

// Agent session list response schema exposed by Claw Router.
type AgentSessionListResponse struct {
	Items []AgentSessionItem `json:"items"`
}
