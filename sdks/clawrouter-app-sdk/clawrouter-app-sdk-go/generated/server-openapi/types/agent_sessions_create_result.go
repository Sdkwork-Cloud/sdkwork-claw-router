package types

// Agent sessions create result schema exposed by Claw Router.
type AgentSessionsCreateResult struct {
	Code string `json:"code"`
	Data AgentSessionResponse `json:"data"`
	Msg string `json:"msg"`
}
