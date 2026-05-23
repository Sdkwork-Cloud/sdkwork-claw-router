package types

// Account points exchanges create result schema exposed by Claw Router.
type AccountPointsExchangesCreateResult struct {
	Code string `json:"code"`
	Data CommerceOperationResponse `json:"data"`
	Msg string `json:"msg"`
}
