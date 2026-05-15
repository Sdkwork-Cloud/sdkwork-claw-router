package types

// Apps delete result schema exposed by Claw Router.
type AppsDeleteResult struct {
	Code string `json:"code"`
	Data AdminAppDeleteResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
