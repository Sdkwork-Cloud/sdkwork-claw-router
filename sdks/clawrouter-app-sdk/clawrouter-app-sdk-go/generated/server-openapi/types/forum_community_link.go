package types

// Forum community link schema exposed by Claw Router.
type ForumCommunityLink struct {
	Id string `json:"id"`
	Label string `json:"label"`
	QrCode MediaResource `json:"qrCode"`
	Tone string `json:"tone"`
	Url string `json:"url"`
}
