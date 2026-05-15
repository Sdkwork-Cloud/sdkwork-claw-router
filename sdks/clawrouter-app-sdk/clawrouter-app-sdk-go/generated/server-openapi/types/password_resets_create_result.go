package types

// Password resets create result schema exposed by Claw Router.
type PasswordResetsCreateResult struct {
	Code string `json:"code"`
	Data NoData `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
