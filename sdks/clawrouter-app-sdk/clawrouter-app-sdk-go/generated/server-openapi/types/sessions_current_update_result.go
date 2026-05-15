package types

// Sessions current update result schema exposed by Claw Router.
type SessionsCurrentUpdateResult struct {
	Code string `json:"code"`
	Data IamSessionResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
