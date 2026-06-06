package types

// Forum overview stats schema exposed by Claw Router.
type ForumOverviewStats struct {
	MemberCount string `json:"memberCount"`
	OnlineMembers string `json:"onlineMembers"`
	TotalComments string `json:"totalComments"`
	TotalPosts string `json:"totalPosts"`
}
