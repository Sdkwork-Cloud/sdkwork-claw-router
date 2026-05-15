package types

// Notifications list result schema exposed by Claw Router.
type NotificationsListResult struct {
	Code string `json:"code"`
	Data MessagesResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
