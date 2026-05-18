package types

// Generation agent runs create result schema exposed by Claw Router.
type GenerationAgentRunsCreateResult struct {
	Code string `json:"code"`
	Data GenerationAgentRunCreateResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
