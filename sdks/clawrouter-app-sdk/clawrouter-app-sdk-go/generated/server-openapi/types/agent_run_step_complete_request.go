package types

// Agent run step complete request schema exposed by Claw Router.
type AgentRunStepCompleteRequest struct {
	ErrorMessageMasked string `json:"errorMessageMasked"`
	Metadata map[string]JsonValue `json:"metadata"`
	OutputJson map[string]JsonValue `json:"outputJson"`
	Status string `json:"status"`
	UsageJson UsageSnapshot `json:"usageJson"`
}
