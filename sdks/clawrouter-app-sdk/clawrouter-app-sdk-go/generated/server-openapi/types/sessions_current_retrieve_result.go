package types

// Sessions current retrieve result schema exposed by Claw Router.
type SessionsCurrentRetrieveResult struct {
	Code string `json:"code"`
	Data IamSessionResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
