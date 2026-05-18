package types

// Generation agent metering event schema exposed by Claw Router.
type GenerationAgentMeteringEvent struct {
	Quantity string `json:"quantity"`
	Type string `json:"type"`
	UsageFactMetadata GenerationAgentUsageFactMetadata `json:"usageFactMetadata"`
}
