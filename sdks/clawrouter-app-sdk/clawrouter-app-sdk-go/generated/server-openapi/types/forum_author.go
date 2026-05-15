package types

// Forum author schema exposed by Claw Router.
type ForumAuthor struct {
	Avatar string `json:"avatar"`
	Bio string `json:"bio"`
	Id int `json:"id"`
	IsFollowing bool `json:"isFollowing"`
	Name string `json:"name"`
}
