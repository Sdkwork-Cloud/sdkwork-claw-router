package types

// Base Claw Router response envelope. Operation-specific Result schemas carry concrete business data.
type PlusApiResult struct {
	Code string `json:"code"`
	Data NoData `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
