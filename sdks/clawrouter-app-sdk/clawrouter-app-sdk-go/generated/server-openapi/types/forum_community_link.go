package types

// Forum community link schema exposed by Claw Router.
type ForumCommunityLink struct {
	Id string `json:"id"`
	Label string `json:"label"`
	QrCodeUrl string `json:"qrCodeUrl"`
	Tone string `json:"tone"`
	Url string `json:"url"`
}
