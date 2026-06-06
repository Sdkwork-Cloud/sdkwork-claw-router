package types

// Forum author schema exposed by Claw Router.
type ForumAuthor struct {
	Avatar MediaResource `json:"avatar"`
	Bio string `json:"bio"`
	Id string `json:"id"`
	IsFollowing bool `json:"isFollowing"`
	Name string `json:"name"`
}
