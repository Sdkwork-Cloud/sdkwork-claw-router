package types

// Sessions create result schema exposed by Claw Router.
type SessionsCreateResult struct {
	Code string `json:"code"`
	Data IamSessionResponse `json:"data"`
	Msg string `json:"msg"`
}
