package types

// Course instructor schema exposed by Claw Router.
type CourseInstructor struct {
	Avatar MediaResource `json:"avatar"`
	Bio string `json:"bio"`
	Name string `json:"name"`
	Title string `json:"title"`
}
