package types

// Addresses list result schema exposed by Claw Router.
type AddressesListResult struct {
	Code string `json:"code"`
	Data CommerceStandardCollectionResponse `json:"data"`
	Msg string `json:"msg"`
}
