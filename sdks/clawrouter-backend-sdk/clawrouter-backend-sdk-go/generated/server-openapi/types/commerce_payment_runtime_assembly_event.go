package types

// Commerce payment runtime assembly event schema exposed by Claw Router.
type CommercePaymentRuntimeAssemblyEvent struct {
	AccountNo string `json:"accountNo"`
	Kind string `json:"kind"`
	Message string `json:"message"`
	ProviderCode string `json:"providerCode"`
	Reason string `json:"reason"`
}
