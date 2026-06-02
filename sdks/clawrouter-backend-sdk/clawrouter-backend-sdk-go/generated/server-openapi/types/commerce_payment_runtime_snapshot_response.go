package types

// Commerce payment runtime snapshot response schema exposed by Claw Router.
type CommercePaymentRuntimeSnapshotResponse struct {
	Environment string `json:"environment"`
	Events []CommercePaymentRuntimeAssemblyEvent `json:"events"`
	RecordedAt string `json:"recordedAt"`
	Summary CommercePaymentRuntimeAssemblySummary `json:"summary"`
}
