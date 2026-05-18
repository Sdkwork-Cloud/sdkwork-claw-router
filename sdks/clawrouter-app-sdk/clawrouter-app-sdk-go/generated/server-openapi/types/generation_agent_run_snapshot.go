package types

// Generation agent run snapshot schema exposed by Claw Router.
type GenerationAgentRunSnapshot struct {
	Id string `json:"id"`
	RequestId string `json:"requestId"`
	Source string `json:"source"`
	Status string `json:"status"`
}
