package types

// Generation list result schema exposed by Claw Router.
type GenerationListResult struct {
	Code string `json:"code"`
	Data GenerationHistoryResponse `json:"data"`
	Msg string `json:"msg"`
}
