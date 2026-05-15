package types

// Forum overview response schema exposed by Claw Router.
type ForumOverviewResponse struct {
	CommunityLinks []ForumCommunityLink `json:"communityLinks"`
	Source ForumOverviewSource `json:"source"`
	Stats ForumOverviewStats `json:"stats"`
}
