package types

// Cart current retrieve result schema exposed by Claw Router.
type CartCurrentRetrieveResult struct {
	Code string `json:"code"`
	Data CommerceStandardResourceResponse `json:"data"`
	Msg string `json:"msg"`
}
