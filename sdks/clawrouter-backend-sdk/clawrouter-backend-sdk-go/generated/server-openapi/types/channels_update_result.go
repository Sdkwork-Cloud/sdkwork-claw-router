package types

// Channels update result schema exposed by Claw Router.
type ChannelsUpdateResult struct {
	Code string `json:"code"`
	Data AdminChannelMutationResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
