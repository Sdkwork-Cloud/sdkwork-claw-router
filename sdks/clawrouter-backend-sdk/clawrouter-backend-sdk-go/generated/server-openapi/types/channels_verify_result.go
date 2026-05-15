package types

// Channels verify result schema exposed by Claw Router.
type ChannelsVerifyResult struct {
	Code string `json:"code"`
	Data AdminChannelTestResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
