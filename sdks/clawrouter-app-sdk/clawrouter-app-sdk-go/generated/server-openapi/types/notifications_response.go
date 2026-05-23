package types

// Notifications response schema exposed by Claw Router.
type NotificationsResponse struct {
	Items []NotificationItem `json:"items"`
}
