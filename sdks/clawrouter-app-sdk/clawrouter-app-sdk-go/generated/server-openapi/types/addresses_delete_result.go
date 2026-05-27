package types

// Addresses delete result schema exposed by Claw Router.
type AddressesDeleteResult struct {
	Code string `json:"code"`
	Data CommerceOperationResponse `json:"data"`
	Msg string `json:"msg"`
}
