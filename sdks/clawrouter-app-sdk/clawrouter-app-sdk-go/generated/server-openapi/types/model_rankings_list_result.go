package types

// Model rankings list result schema exposed by Claw Router.
type ModelRankingsListResult struct {
	Code string `json:"code"`
	Data ModelRankingsSnapshot `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
