package types

// Addresses update result schema exposed by Claw Router.
type AddressesUpdateResult struct {
	Code string `json:"code"`
	Data CommerceOperationResponse `json:"data"`
	Msg string `json:"msg"`
}
