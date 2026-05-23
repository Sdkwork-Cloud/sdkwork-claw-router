package types

// Agent definitions retrieve result schema exposed by Claw Router.
type AgentDefinitionsRetrieveResult struct {
	Code string `json:"code"`
	Data AgentItem `json:"data"`
	Msg string `json:"msg"`
}
