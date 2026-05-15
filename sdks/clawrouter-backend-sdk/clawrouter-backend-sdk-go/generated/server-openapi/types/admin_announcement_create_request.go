package types

// Admin announcement create request schema exposed by Claw Router.
type AdminAnnouncementCreateRequest struct {
	Content string `json:"content"`
	Status string `json:"status"`
	Target string `json:"target"`
	Title string `json:"title"`
}
