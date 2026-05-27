package types

// Addresses default selection create result schema exposed by Claw Router.
type AddressesDefaultSelectionCreateResult struct {
	Code string `json:"code"`
	Data CommerceOperationResponse `json:"data"`
	Msg string `json:"msg"`
}
