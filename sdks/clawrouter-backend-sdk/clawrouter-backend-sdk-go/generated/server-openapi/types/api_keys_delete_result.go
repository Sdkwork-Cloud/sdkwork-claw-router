package types

// Api keys delete result schema exposed by Claw Router.
type ApiKeysDeleteResult struct {
	Code string `json:"code"`
	Data AdminDeleteResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
