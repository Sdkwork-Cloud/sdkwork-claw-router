package types

// Agent definitions create result schema exposed by Claw Router.
type AgentDefinitionsCreateResult struct {
	Code string `json:"code"`
	Data AgentItemResponse `json:"data"`
	Msg string `json:"msg"`
}
