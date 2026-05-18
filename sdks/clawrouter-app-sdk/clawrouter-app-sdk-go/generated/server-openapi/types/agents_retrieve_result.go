package types

// Agents retrieve result schema exposed by Claw Router.
type AgentsRetrieveResult struct {
	Code string `json:"code"`
	Data AgentItem `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
