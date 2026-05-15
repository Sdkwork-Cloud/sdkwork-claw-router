package types

// Sessions refresh result schema exposed by Claw Router.
type SessionsRefreshResult struct {
	Code string `json:"code"`
	Data IamSessionResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
