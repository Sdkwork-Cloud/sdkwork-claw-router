package types

// Account points transfers create result schema exposed by Claw Router.
type AccountPointsTransfersCreateResult struct {
	Code string `json:"code"`
	Data CommerceOperationResponse `json:"data"`
	Msg string `json:"msg"`
}
