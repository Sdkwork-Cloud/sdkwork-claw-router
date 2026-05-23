package types

// Comments delete result schema exposed by Claw Router.
type CommentsDeleteResult struct {
	Code string `json:"code"`
	Data NoData `json:"data"`
	Msg string `json:"msg"`
}
