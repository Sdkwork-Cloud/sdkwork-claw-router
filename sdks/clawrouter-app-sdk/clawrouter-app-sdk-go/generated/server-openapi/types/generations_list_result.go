package types

// Generations list result schema exposed by Claw Router.
type GenerationsListResult struct {
	Code string `json:"code"`
	Data GenerationHistoryResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
