package types

// Agent run complete request schema exposed by Claw Router.
type AgentRunCompleteRequest struct {
	ErrorMessageMasked string `json:"errorMessageMasked"`
	Metadata map[string]JsonValue `json:"metadata"`
	OutputMessage string `json:"outputMessage"`
	Status string `json:"status"`
	UsageJson UsageSnapshot `json:"usageJson"`
}
