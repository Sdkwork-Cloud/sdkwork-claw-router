package types

// Generation agent run step snapshot schema exposed by Claw Router.
type GenerationAgentRunStepSnapshot struct {
	Id string `json:"id"`
	Index int `json:"index"`
	Status string `json:"status"`
	Title string `json:"title"`
	Type string `json:"type"`
}
