package types

// Channels delete result schema exposed by Claw Router.
type ChannelsDeleteResult struct {
	Code string `json:"code"`
	Data AdminDeleteResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
