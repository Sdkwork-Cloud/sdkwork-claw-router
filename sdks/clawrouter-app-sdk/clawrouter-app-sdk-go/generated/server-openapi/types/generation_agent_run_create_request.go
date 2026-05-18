package types

// Generation agent run create request schema exposed by Claw Router.
type GenerationAgentRunCreateRequest struct {
	Prompt string `json:"prompt"`
	SelectedModel string `json:"selectedModel"`
}
