package types

// Announcements list result schema exposed by Claw Router.
type AnnouncementsListResult struct {
	Code string `json:"code"`
	Data AdminAnnouncementsResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
