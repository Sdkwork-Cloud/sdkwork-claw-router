package types

// Notifications list result schema exposed by Claw Router.
type NotificationsListResult struct {
	Code string `json:"code"`
	Data NotificationsResponse `json:"data"`
	Msg string `json:"msg"`
}
