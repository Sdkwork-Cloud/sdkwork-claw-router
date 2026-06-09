package types

// Sessions current delete result schema exposed by Claw Router.
type SessionsCurrentDeleteResult struct {
	Code string `json:"code"`
	Data NoData `json:"data"`
	Msg string `json:"msg"`
}
