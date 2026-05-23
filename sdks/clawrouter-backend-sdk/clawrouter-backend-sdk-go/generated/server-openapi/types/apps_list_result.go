package types

// Apps list result schema exposed by Claw Router.
type AppsListResult struct {
	Code string `json:"code"`
	Data AdminAppListResponse `json:"data"`
	Msg string `json:"msg"`
}
