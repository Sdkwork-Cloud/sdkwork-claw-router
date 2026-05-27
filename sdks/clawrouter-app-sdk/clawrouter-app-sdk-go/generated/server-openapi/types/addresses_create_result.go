package types

// Addresses create result schema exposed by Claw Router.
type AddressesCreateResult struct {
	Code string `json:"code"`
	Data CommerceOperationResponse `json:"data"`
	Msg string `json:"msg"`
}
