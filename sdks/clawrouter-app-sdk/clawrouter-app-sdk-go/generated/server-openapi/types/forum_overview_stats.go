package types

// Forum overview stats schema exposed by Claw Router.
type ForumOverviewStats struct {
	MemberCount int `json:"memberCount"`
	OnlineMembers int `json:"onlineMembers"`
	TotalComments int `json:"totalComments"`
	TotalPosts int `json:"totalPosts"`
}
