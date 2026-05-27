package types

// Cart items create result schema exposed by Claw Router.
type CartItemsCreateResult struct {
	Code string `json:"code"`
	Data CommerceOperationResponse `json:"data"`
	Msg string `json:"msg"`
}
