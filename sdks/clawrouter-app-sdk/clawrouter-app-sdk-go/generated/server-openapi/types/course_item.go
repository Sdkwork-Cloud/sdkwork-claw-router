package types

// Course item schema exposed by Claw Router.
type CourseItem struct {
	Category string `json:"category"`
	CategoryLabel string `json:"categoryLabel"`
	CommentCount int `json:"commentCount"`
	Content string `json:"content"`
	ContentId int `json:"contentId"`
	CourseCode string `json:"courseCode"`
	Currency string `json:"currency"`
	Description string `json:"description"`
	DurationText string `json:"durationText"`
	Engagement CourseEngagement `json:"engagement"`
	ExternalBvid string `json:"externalBvid"`
	Id string `json:"id"`
	Instructor CourseInstructor `json:"instructor"`
	IsCollection bool `json:"isCollection"`
	LessonsCount int `json:"lessonsCount"`
	Level int `json:"level"`
	LevelLabel string `json:"levelLabel"`
	PriceAmount string `json:"priceAmount"`
	PublishedAt string `json:"publishedAt"`
	RatingScore float64 `json:"ratingScore"`
	StudentsCount int `json:"studentsCount"`
	Tags []string `json:"tags"`
	Thumbnail MediaResource `json:"thumbnail"`
	Title string `json:"title"`
}
