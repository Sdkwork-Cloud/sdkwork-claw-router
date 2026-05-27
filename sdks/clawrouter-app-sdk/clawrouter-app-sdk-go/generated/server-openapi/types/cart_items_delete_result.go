package types

// Cart items delete result schema exposed by Claw Router.
type CartItemsDeleteResult struct {
	Code string `json:"code"`
	Data CommerceOperationResponse `json:"data"`
	Msg string `json:"msg"`
}
