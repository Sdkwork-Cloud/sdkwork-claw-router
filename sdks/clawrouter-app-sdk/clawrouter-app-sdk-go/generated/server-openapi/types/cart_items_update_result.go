package types

// Cart items update result schema exposed by Claw Router.
type CartItemsUpdateResult struct {
	Code string `json:"code"`
	Data CommerceOperationResponse `json:"data"`
	Msg string `json:"msg"`
}
