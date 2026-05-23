package types

// Comments statistics list result schema exposed by Claw Router.
type CommentsStatisticsListResult struct {
	Code string `json:"code"`
	Data ForumCommentStatistics `json:"data"`
	Msg string `json:"msg"`
}
