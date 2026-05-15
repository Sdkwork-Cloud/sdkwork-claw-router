package types

// Announcements update result schema exposed by Claw Router.
type AnnouncementsUpdateResult struct {
	Code string `json:"code"`
	Data AdminAnnouncementMutationResponse `json:"data"`
	Message string `json:"message"`
	Msg string `json:"msg"`
}
