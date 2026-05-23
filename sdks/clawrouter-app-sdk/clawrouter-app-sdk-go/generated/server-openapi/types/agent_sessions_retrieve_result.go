package types

// Agent sessions retrieve result schema exposed by Claw Router.
type AgentSessionsRetrieveResult struct {
	Code string `json:"code"`
	Data AgentSessionItem `json:"data"`
	Msg string `json:"msg"`
}
