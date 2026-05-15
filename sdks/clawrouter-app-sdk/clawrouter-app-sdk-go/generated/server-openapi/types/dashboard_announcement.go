package types

// Dashboard announcement schema exposed by Claw Router.
type DashboardAnnouncement struct {
	Id int `json:"id"`
	Text string `json:"text"`
	Time string `json:"time"`
	Type string `json:"type"`
}
