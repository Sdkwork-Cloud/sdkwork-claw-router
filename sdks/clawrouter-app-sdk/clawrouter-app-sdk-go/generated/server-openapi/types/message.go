package types

// Message schema exposed by Claw Router.
type Message struct {
	Content string `json:"content"`
	Desc string `json:"desc"`
	Id string `json:"id"`
	Read bool `json:"read"`
	ShowAsPopup bool `json:"showAsPopup"`
	Time string `json:"time"`
	Title string `json:"title"`
	Type string `json:"type"`
}
